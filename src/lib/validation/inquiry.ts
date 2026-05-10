export const safeTrim = (value: FormDataEntryValue | null) =>
    typeof value === "string" ? value.trim() : "";

export const normalizePhone = (value: string) => {
    const digits = value.replace(/\D/g, "");

    // Support common Pakistani formats like +92XXXXXXXXXX or 0092XXXXXXXXXX.
    if (digits.startsWith("0092") && digits.length === 14) {
        return `0${digits.slice(4)}`;
    }

    if (digits.startsWith("92") && digits.length === 12) {
        return `0${digits.slice(2)}`;
    }

    return digits;
};

export const isValidLocalPhone = (value: string) => /^03\d{9}$/.test(value);

export const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
