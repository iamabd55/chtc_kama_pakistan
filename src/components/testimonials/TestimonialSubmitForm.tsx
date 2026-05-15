"use client";

import { useState } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TestimonialSubmitFormProps {
    initialError?: string | null;
    initialSuccess?: boolean;
    compact?: boolean;
}

export default function TestimonialSubmitForm({
    initialError = null,
    initialSuccess = false,
    compact = false,
}: TestimonialSubmitFormProps) {
    const [customerName, setCustomerName] = useState("");
    const [customerTitle, setCustomerTitle] = useState("");
    const [company, setCompany] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState<number | null>(5);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(initialError);
    const [success, setSuccess] = useState(initialSuccess);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/testimonials/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customer_name: customerName,
                    customer_title: customerTitle,
                    company,
                    content,
                    rating,
                }),
            });

            const payload = await response.json().catch(() => ({}));

            if (!response.ok || !payload.ok) {
                setError(payload.error || "Unable to submit your review. Please try again.");
                return;
            }

            setSuccess(true);
            setCustomerName("");
            setCustomerTitle("");
            setCompany("");
            setContent("");
            setRating(5);
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div
                className={cn(
                    "rounded-2xl border border-emerald-200 bg-emerald-50/80 p-8 text-center",
                    compact && "p-6"
                )}
            >
                <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-600" />
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    Thank you for your feedback
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Your review has been submitted. Our team will verify it shortly; approved reviews appear on the website.
                </p>
            </div>
        );
    }

    const displayRating = hoverRating ?? rating;

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                "rounded-2xl border bg-card p-6 md:p-8 shadow-sm space-y-4",
                compact && "p-5"
            )}
        >
            {!compact && (
                <div className="mb-2">
                    <h3 className="font-display text-xl font-bold text-foreground">Share your experience</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Tell us about your fleet, service, or purchase experience with Al Nasir Motors.
                    </p>
                </div>
            )}

            {error && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            <div className={cn("grid gap-4", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
                <Input
                    required
                    placeholder="Your name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
                <Input
                    placeholder="Company (optional)"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                />
            </div>

            <Input
                placeholder="Your role / title (optional)"
                value={customerTitle}
                onChange={(e) => setCustomerTitle(e.target.value)}
            />

            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Your rating
                </p>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            type="button"
                            aria-label={`Rate ${value} stars`}
                            className="p-0.5 transition-transform hover:scale-110"
                            onMouseEnter={() => setHoverRating(value)}
                            onMouseLeave={() => setHoverRating(null)}
                            onClick={() => setRating(value)}
                        >
                            <Star
                                className={cn(
                                    "h-6 w-6",
                                    displayRating && value <= displayRating
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-muted-foreground/40"
                                )}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <textarea
                required
                minLength={20}
                maxLength={2000}
                rows={compact ? 4 : 5}
                placeholder="Describe your experience (min. 20 characters) *"
                className="w-full border rounded-lg px-3 py-2.5 text-sm resize-y min-h-[100px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                <Send className="w-4 h-4 mr-2" />
                {submitting ? "Submitting…" : "Submit review"}
            </Button>
        </form>
    );
}
