import type { Inquiry } from "@/lib/supabase/types";

export const INQUIRY_REFERENCE_PREFIX = "INQ-";
const INQUIRY_REFERENCE_SUFFIX_LENGTH = 8;

export function formatInquiryReferenceFromId(id: string) {
    return `${INQUIRY_REFERENCE_PREFIX}${id.replace(/-/g, "").slice(0, INQUIRY_REFERENCE_SUFFIX_LENGTH).toUpperCase()}`;
}

export function normalizeInquiryReference(value: string) {
    const cleaned = value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (!cleaned) {
        return "";
    }

    const suffix = cleaned.startsWith("INQ") ? cleaned.slice(3) : cleaned;
    return `${INQUIRY_REFERENCE_PREFIX}${suffix.slice(0, INQUIRY_REFERENCE_SUFFIX_LENGTH)}`;
}

export type TrackerStage = "received" | "in-review" | "responded";

export type InquiryTrackerState = {
    stage: TrackerStage;
    stepIndex: number;
    title: string;
    description: string;
};

export function getInquiryTrackerState(status: Inquiry["status"] | null | undefined): InquiryTrackerState {
    switch (status) {
        case "contacted":
        case "in-progress":
            return {
                stage: "in-review",
                stepIndex: 1,
                title: "In Review",
                description: "Our team has reviewed your inquiry and is preparing a response.",
            };
        case "converted":
        case "closed":
            return {
                stage: "responded",
                stepIndex: 2,
                title: "Responded",
                description: "Your inquiry has been responded to and is now closed on our side.",
            };
        case "new":
        default:
            return {
                stage: "received",
                stepIndex: 0,
                title: "Received",
                description: "We have received your inquiry and it is waiting to be reviewed.",
            };
    }
}
