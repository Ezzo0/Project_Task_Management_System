// Helper to remove specified fields from the saved object before returning it
export const sanitizeObj = (obj: any, ...excludeFields: string[]) => {
  if (!obj) return obj;
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !excludeFields.includes(key)),
  );
};
