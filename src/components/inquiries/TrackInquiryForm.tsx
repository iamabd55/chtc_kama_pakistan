"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Search, ShieldCheck } from "lucide-react";
import { normalizeInquiryReference } from "@/lib/inquiries";

type TrackerResult = {
    reference: string;
    status: string;
    statusKey: "received" | "in-review" | "responded";
    statusDescription: string;
    stepIndex: number;
    submittedAt: string;
    updatedAt: string;
};

const steps = [
    {
        key: "received",
        title: "Received",
        description: "Your inquiry is logged and waiting for a team review.",
    },
    {
        key: "in-review",
        title: "In Review",
        description: "Our team is checking the details and preparing a response.",
    },
    {
        key: "responded",
        title: "Responded",
        description: "A reply has been sent and your inquiry is now closed out.",
    },
] as const;

type TrackInquiryFormProps = {
    initialRef?: string;
};

export default function TrackInquiryForm({ initialRef = "" }: TrackInquiryFormProps) {
    const [reference, setReference] = useState(initialRef);
    const [submittedReference, setSubmittedReference] = useState(initialRef);
    const [result, setResult] = useState<TrackerResult | null>(null);
    const [loading, setLoading] = useState(Boolean(initialRef));
    const [error, setError] = useState<string | null>(null);

    const normalizedReference = useMemo(() => normalizeInquiryReference(reference), [reference]);

    const runLookup = async (value: string) => {
        const nextReference = normalizeInquiryReference(value);

        if (!nextReference) {
            setError("Enter a valid reference number like INQ-1234ABCD.");
            setResult(null);
            return;
        }

        setLoading(true);
        setError(null);
        setSubmittedReference(nextReference);

        try {
            const response = await fetch(`/api/inquiries/track?ref=${encodeURIComponent(nextReference)}`, {
                headers: { Accept: "application/json" },
            });

            const payload = await response.json().catch(() => ({}));

            if (!response.ok || !payload?.ok) {
                setResult(null);
                setError(
                    typeof payload?.error === "string"
                        ? payload.error
                        : "Could not find this inquiry right now."
                );
                return;
            }

            setResult(payload.inquiry as TrackerResult);
        } catch {
            setResult(null);
            setError("Network issue while checking your inquiry. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialRef) {
            void runLookup(initialRef);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialRef]);

    const activeStep = result?.stepIndex ?? -1;

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-8 text-white shadow-[0_30px_90px_rgba(2,8,23,0.35)] backdrop-blur-xl md:p-10">
                <div className="mb-8 flex items-center gap-3 text-xs font-display font-bold uppercase tracking-[0.28em] text-[#FFBB82]">
                    <ShieldCheck className="h-4 w-4" />
                    Secure status lookup
                </div>

                <h2 className="font-display text-3xl font-bold leading-tight md:text-4xl">
                    Track your inquiry without waiting for an email reply.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/72 md:text-base">
                    Paste the reference number from your confirmation message or email and we’ll show the current progress instantly.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {steps.map((step, index) => {
                        const isComplete = activeStep > index;
                        const isActive = activeStep === index;

                        return (
                            <div
                                key={step.key}
                                className={`rounded-2xl border p-4 transition-all ${isActive ? "border-[#FF8622]/60 bg-white/10" : isComplete ? "border-emerald-400/30 bg-emerald-400/10" : "border-white/10 bg-white/5"}`}
                            >
                                <div className="mb-3 flex items-center justify-between gap-2">
                                    <span className="text-[11px] font-display font-semibold uppercase tracking-[0.22em] text-white/55">
                                        Step {index + 1}
                                    </span>
                                    <span className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-[#FF8622]" : isComplete ? "bg-emerald-400" : "bg-white/25"}`} />
                                </div>
                                <h3 className="font-display text-base font-semibold text-white">{step.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-white/65">{step.description}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/65">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                        <Clock3 className="h-4 w-4 text-[#FFBB82]" />
                        Typical response within 24 business hours
                    </span>
                    <Link href="/contact" prefetch={false} className="inline-flex items-center gap-2 text-[#FFBB82] transition-colors hover:text-white">
                        Need help finding your ref?
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            <div className="rounded-[2rem] border bg-card p-6 shadow-lg md:p-8">
                <div className="mb-6">
                    <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Track Inquiry</h1>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Enter your reference number to see whether your inquiry is Received, In Review, or Responded.
                    </p>
                </div>

                <form
                    className="space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        void runLookup(reference);
                    }}
                >
                    <div className="space-y-2">
                        <label htmlFor="inquiry-reference" className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Reference Number
                        </label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                id="inquiry-reference"
                                value={reference}
                                onChange={(event) => setReference(event.target.value)}
                                placeholder="INQ-1234ABCD"
                                className="w-full rounded-xl border bg-background py-3.5 pl-11 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
                                autoComplete="off"
                                inputMode="text"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Example: INQ-1234ABCD. You can paste the ref exactly as shown in your confirmation email.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-display font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-kama-blue-dark disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? "Checking..." : "Check Status"}
                    </button>
                </form>

                {error && (
                    <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="mt-6 rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/10 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-[11px] font-display font-semibold uppercase tracking-[0.22em] text-emerald-800/70">
                                    Current status
                                </p>
                                <h3 className="mt-1 font-display text-2xl font-bold text-emerald-950">{result.status}</h3>
                            </div>
                            <span className="inline-flex items-center rounded-full border border-emerald-600/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                                {result.reference}
                            </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-emerald-950/80">
                            {result.statusDescription}
                        </p>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl bg-white/70 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Submitted</p>
                                <p className="mt-1 text-sm font-medium text-slate-900">
                                    {new Date(result.submittedAt).toLocaleString("en-PK", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white/70 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Updated</p>
                                <p className="mt-1 text-sm font-medium text-slate-900">
                                    {new Date(result.updatedAt).toLocaleString("en-PK", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {!result && submittedReference && !loading && !error && (
                    <div className="mt-6 rounded-xl border border-dashed border-muted-foreground/30 px-4 py-3 text-sm text-muted-foreground">
                        We checked {submittedReference}, but there is no live status yet.
                    </div>
                )}
            </div>
        </div>
    );
}
