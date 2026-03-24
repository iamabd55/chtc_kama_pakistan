"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type FormValues = {
    full_name: string;
    phone: string;
    email: string;
    city: string;
    message: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

type ProductInquiryFormProps = {
    productId: string;
    productSlug: string;
    returnUrl: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyValues: FormValues = {
    full_name: "",
    phone: "",
    email: "",
    city: "",
    message: "",
};

function validate(values: FormValues): FieldErrors {
    const errors: FieldErrors = {};

    if (!values.full_name.trim()) {
        errors.full_name = "Full name is required.";
    }

    if (!values.phone.trim()) {
        errors.phone = "Phone number is required.";
    } else if (!/^\d{11}$/.test(values.phone)) {
        errors.phone = "Use 11 digits only (example: 03001234567).";
    }

    if (values.email.trim() && !EMAIL_REGEX.test(values.email.trim())) {
        errors.email = "Enter a valid email address.";
    }

    if (!values.city.trim()) {
        errors.city = "City is required.";
    }

    return errors;
}

export default function ProductInquiryForm({
    productId,
    productSlug,
    returnUrl,
}: ProductInquiryFormProps) {
    const [values, setValues] = useState<FormValues>(emptyValues);
    const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const visibleErrors = useMemo(() => {
        const next: FieldErrors = {};
        (Object.keys(errors) as (keyof FormValues)[]).forEach((key) => {
            if (touched[key] || submitting) {
                next[key] = errors[key];
            }
        });
        return next;
    }, [errors, touched, submitting]);

    const setFieldValue = (field: keyof FormValues, value: string) => {
        const nextValues = {
            ...values,
            [field]: value,
        };
        setValues(nextValues);
        setErrors(validate(nextValues));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setServerError(null);
        setSuccess(null);

        const nextErrors = validate(values);
        setErrors(nextErrors);
        setTouched({
            full_name: true,
            phone: true,
            email: true,
            city: true,
            message: true,
        });

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.set("full_name", values.full_name.trim());
            formData.set("phone", values.phone.trim());
            formData.set("email", values.email.trim());
            formData.set("city", values.city.trim());
            formData.set("message", values.message.trim());
            formData.set("product_id", productId);
            formData.set("product_slug", productSlug);
            formData.set("return_url", returnUrl);

            const response = await fetch("/api/inquiries/product", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "fetch",
                },
                body: formData,
            });

            const payload = await response.json().catch(() => ({}));
            if (!response.ok || !payload?.ok) {
                const field = payload?.field as keyof FormValues | undefined;
                const message =
                    typeof payload?.error === "string"
                        ? payload.error
                        : "Could not submit inquiry. Please check your details and try again.";

                setServerError(message);
                if (field) {
                    setErrors((prev) => ({ ...prev, [field]: message }));
                    setTouched((prev) => ({ ...prev, [field]: true }));
                }
                return;
            }

            setValues(emptyValues);
            setTouched({});
            setErrors({});
            setSuccess("Inquiry submitted successfully. We have emailed your confirmation and status.");
        } catch {
            setServerError("Network issue while submitting inquiry. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form method="post" action="/api/inquiries/product" className="space-y-5 md:space-y-6" noValidate onSubmit={handleSubmit}>
            <input type="hidden" name="product_id" value={productId} />
            <input type="hidden" name="product_slug" value={productSlug} />
            <input type="hidden" name="return_url" value={returnUrl} />

            {success && (
                <div className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>
            )}

            {serverError && (
                <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                    {serverError}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div>
                    <input
                        name="full_name"
                        type="text"
                        value={values.full_name}
                        onChange={(e) => setFieldValue("full_name", e.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, full_name: true }))}
                        required
                        placeholder="Full Name *"
                        className="w-full px-4 py-3.5 border rounded-lg bg-background text-foreground text-sm"
                    />
                    {visibleErrors.full_name && (
                        <p className="mt-1.5 text-xs text-red-600">{visibleErrors.full_name}</p>
                    )}
                </div>

                <div>
                    <input
                        name="phone"
                        type="tel"
                        value={values.phone}
                        onChange={(e) => setFieldValue("phone", e.target.value.replace(/\D/g, "").slice(0, 11))}
                        onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                        required
                        inputMode="numeric"
                        placeholder="Phone *"
                        className="w-full px-4 py-3.5 border rounded-lg bg-background text-foreground text-sm"
                    />
                    {visibleErrors.phone ? (
                        <p className="mt-1.5 text-xs text-red-600">{visibleErrors.phone}</p>
                    ) : (
                        <p className="mt-1.5 text-xs text-muted-foreground">Use 11 digits (03XXXXXXXXX)</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div>
                    <input
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={(e) => setFieldValue("email", e.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                        placeholder="Email"
                        className="w-full px-4 py-3.5 border rounded-lg bg-background text-foreground text-sm"
                    />
                    {visibleErrors.email && (
                        <p className="mt-1.5 text-xs text-red-600">{visibleErrors.email}</p>
                    )}
                </div>

                <div>
                    <input
                        name="city"
                        type="text"
                        value={values.city}
                        onChange={(e) => setFieldValue("city", e.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, city: true }))}
                        required
                        placeholder="City *"
                        className="w-full px-4 py-3.5 border rounded-lg bg-background text-foreground text-sm"
                    />
                    {visibleErrors.city && (
                        <p className="mt-1.5 text-xs text-red-600">{visibleErrors.city}</p>
                    )}
                </div>
            </div>

            <div>
                <textarea
                    name="message"
                    rows={5}
                    value={values.message}
                    onChange={(e) => setFieldValue("message", e.target.value)}
                    placeholder="Your requirement"
                    className="w-full px-4 py-3.5 border rounded-lg bg-background text-foreground text-sm"
                />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 pt-1 md:pt-2">
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto sm:px-9 py-3.5 bg-primary text-primary-foreground font-display font-semibold text-xs uppercase tracking-wider rounded-md hover:bg-kama-blue-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {submitting ? "Submitting..." : "Submit Inquiry"}
                </button>
                <Link
                    href={`/get-quote?product=${productSlug}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-primary/40 rounded-md text-primary text-xs font-display font-semibold uppercase tracking-wider hover:bg-primary/5 transition-colors"
                >
                    Prefer Pricing? Get a Quote
                </Link>
            </div>
        </form>
    );
}
