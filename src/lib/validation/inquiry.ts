export const safeTrim = (value: FormDataEntryValue | null) =>
    typeof value === "string" ? value.trim() : "";

export const normalizePhone = (value: string) => value.replace(/\D/g, "");

export const isValidLocalPhone = (value: string) => /^\d{11}$/.test(value);

export const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
