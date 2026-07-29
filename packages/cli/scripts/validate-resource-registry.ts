import path from "node:path";
import ts from "typescript";
import { resourceDefinitions } from "../src/commands/resources/registry";

const repositoryRoot = path.resolve(import.meta.dirname, "../../..");
const nodePackageRoot = path.join(repositoryRoot, "packages/node");
const nodeConfigPath = path.join(nodePackageRoot, "tsconfig.json");
const configFile = ts.readConfigFile(nodeConfigPath, ts.sys.readFile);

if (configFile.error) {
  throw new Error(
    ts.flattenDiagnosticMessageText(configFile.error.messageText, "\n"),
  );
}

const parsedConfig = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  nodePackageRoot,
);
const clientPath = path.join(nodePackageRoot, "src/client.ts");
const program = ts.createProgram({
  rootNames: [clientPath],
  options: parsedConfig.options,
});
const checker = program.getTypeChecker();
const clientSource = program.getSourceFile(clientPath);
const commetClass = clientSource?.statements.find(
  (statement): statement is ts.ClassDeclaration =>
    ts.isClassDeclaration(statement) && statement.name?.text === "Commet",
);

if (!commetClass) {
  throw new Error("Could not find the Commet client class");
}

const commetType = checker.getTypeAtLocation(commetClass);
const failures: string[] = [];

function parameterKeys(parameterType: ts.Type): Set<string> {
  const variants = parameterType.isUnion()
    ? parameterType.types
    : [parameterType];
  return new Set(
    variants.flatMap((variant) =>
      checker.getPropertiesOfType(variant).map((property) => property.name),
    ),
  );
}

for (const resourceDefinition of resourceDefinitions) {
  const resourceSymbol = checker.getPropertyOfType(
    commetType,
    resourceDefinition.sdkProperty,
  );
  const resourceDeclaration =
    resourceSymbol?.valueDeclaration ?? resourceSymbol?.declarations?.[0];

  if (!(resourceSymbol && resourceDeclaration)) {
    failures.push(
      `${resourceDefinition.name}: SDK resource ${resourceDefinition.sdkProperty} does not exist`,
    );
    continue;
  }

  const resourceType = checker.getTypeOfSymbolAtLocation(
    resourceSymbol,
    resourceDeclaration,
  );

  for (const [actionName, actionDefinition] of Object.entries(
    resourceDefinition.actions,
  )) {
    const methodSymbol = checker.getPropertyOfType(
      resourceType,
      actionDefinition.method,
    );
    const methodDeclaration =
      methodSymbol?.valueDeclaration ?? methodSymbol?.declarations?.[0];

    if (!(methodSymbol && methodDeclaration)) {
      failures.push(
        `${resourceDefinition.name} ${actionName}: SDK method ${actionDefinition.method} does not exist`,
      );
      continue;
    }

    const methodType = checker.getTypeOfSymbolAtLocation(
      methodSymbol,
      methodDeclaration,
    );
    const signature = checker.getSignaturesOfType(
      methodType,
      ts.SignatureKind.Call,
    )[0];
    const bodyParameters = actionDefinition.params.filter(
      (parameter) => !parameter.requestOption,
    );
    const firstParameter = signature?.getParameters()[0];

    if (!firstParameter) {
      if (bodyParameters.length > 0) {
        failures.push(
          `${resourceDefinition.name} ${actionName}: SDK method accepts no parameters`,
        );
      }
      continue;
    }

    const firstParameterDeclaration =
      firstParameter.valueDeclaration ?? firstParameter.declarations?.[0];
    if (!firstParameterDeclaration) {
      failures.push(
        `${resourceDefinition.name} ${actionName}: could not inspect SDK parameters`,
      );
      continue;
    }

    const allowedKeys = parameterKeys(
      checker.getTypeOfSymbolAtLocation(
        firstParameter,
        firstParameterDeclaration,
      ),
    );

    for (const parameter of bodyParameters) {
      const rootKey = parameter.sdkKey.split(".")[0];
      if (rootKey && !allowedKeys.has(rootKey)) {
        failures.push(
          `${resourceDefinition.name} ${actionName}: ${parameter.sdkKey} is not an SDK parameter`,
        );
      }
    }
  }
}

if (failures.length > 0) {
  throw new Error(`CLI resource registry drift:\n${failures.join("\n")}`);
}

console.log(
  `Validated ${resourceDefinitions.length} CLI resources against @commet/node`,
);
