const GLOBAL_OPTIONS_WITH_VALUES = new Set(["--output"]);

export function resolveCliCommand(args: string[]): string {
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (!argument) continue;
    if (GLOBAL_OPTIONS_WITH_VALUES.has(argument)) {
      index += 1;
      continue;
    }
    if (argument.startsWith("-")) continue;
    return argument;
  }
  return "(default)";
}
