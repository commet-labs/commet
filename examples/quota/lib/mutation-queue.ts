let pendingMutations: Promise<unknown> = Promise.resolve();

export function enqueueMutation<Result>(
  mutation: () => Promise<Result>,
): Promise<Result> {
  const run = pendingMutations.then(mutation, mutation);
  pendingMutations = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}
