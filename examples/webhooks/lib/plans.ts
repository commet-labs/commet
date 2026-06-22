const planCodePattern = /^[a-z0-9_]+$/;

export function normalizePlanCode(value: FormDataEntryValue | string | null) {
  if (typeof value !== "string") {
    return null;
  }

  const planCode = value.trim();
  if (!planCodePattern.test(planCode)) {
    return null;
  }

  return planCode;
}
