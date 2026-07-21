export const isRequired = (v: unknown) =>
  typeof v === "string" ? v.trim().length > 0 : v != null;

export const isEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export const minLength = (v: string, n: number) => v.length >= n;

export const matches = (a: string, b: string) => a === b;

export const isPhone = (v: string) => /^\+?[0-9\s\-()]{7,}$/.test(v.trim());
