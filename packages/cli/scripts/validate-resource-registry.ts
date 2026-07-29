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

function typeVariants(type: ts.Type): ts.Type[] {
  const nonNullableType = checker.getNonNullableType(type);
  return nonNullableType.isUnion()
    ? nonNullableType.types.flatMap(typeVariants)
    : [nonNullableType];
}

function hasParameterPath(type: ts.Type, pathSegments: string[]): boolean {
  const [segment, ...remainingSegments] = pathSegments;
  if (!segment) return true;

  return typeVariants(type).some((variant) => {
    const property = checker.getPropertyOfType(variant, segment);
    const propertyDeclaration =
      property?.valueDeclaration ?? property?.declarations?.[0];
    if (!(property && propertyDeclaration)) return false;
    if (remainingSegments.length === 0) return true;

    return hasParameterPath(
      checker.getTypeOfSymbolAtLocation(property, propertyDeclaration),
      remainingSegments,
    );
  });
}

function validateParameters(
  resourceName: string,
  actionName: string,
  parameters: Array<{ sdkKey: string }>,
  methodParameter: ts.Symbol | undefined,
  parameterKind: string,
): void {
  if (parameters.length === 0) return;
  if (!methodParameter) {
    failures.push(
      `${resourceName} ${actionName}: SDK method accepts no ${parameterKind}`,
    );
    return;
  }

  const methodParameterDeclaration =
    methodParameter.valueDeclaration ?? methodParameter.declarations?.[0];
  if (!methodParameterDeclaration) {
    failures.push(
      `${resourceName} ${actionName}: could not inspect SDK ${parameterKind}`,
    );
    return;
  }

  const methodParameterType = checker.getTypeOfSymbolAtLocation(
    methodParameter,
    methodParameterDeclaration,
  );
  for (const parameter of parameters) {
    if (!hasParameterPath(methodParameterType, parameter.sdkKey.split("."))) {
      failures.push(
        `${resourceName} ${actionName}: ${parameter.sdkKey} is not an SDK ${parameterKind}`,
      );
    }
  }
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
    const requestOptionParameters = actionDefinition.params.filter(
      (parameter) => parameter.requestOption,
    );
    const methodParameters = signature?.getParameters() ?? [];
    validateParameters(
      resourceDefinition.name,
      actionName,
      bodyParameters,
      methodParameters[0],
      "request parameter",
    );
    validateParameters(
      resourceDefinition.name,
      actionName,
      requestOptionParameters,
      methodParameters[bodyParameters.length > 0 ? 1 : 0],
      "request option",
    );
  }
}

if (failures.length > 0) {
  throw new Error(`CLI resource registry drift:\n${failures.join("\n")}`);
}

console.log(
  `Validated ${resourceDefinitions.length} CLI resources against @commet/node`,
);
