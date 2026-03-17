import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const safeTrim = (value: FormDataEntryValue | null) =>
    typeof value === "string" ? value.trim() : "";

export async function POST(request: Request) {
    const form = await request.formData();

    const careerPostId = safeTrim(form.get("career_post_id"));
    const applicantName = safeTrim(form.get("applicant_name"));
    const email = safeTrim(form.get("email"));
    const phone = safeTrim(form.get("phone"));
    const cvUrl = safeTrim(form.get("cv_url"));
    const coverLetter = safeTrim(form.get("cover_letter"));

    if (!careerPostId || !applicantName || !email || !phone || !cvUrl) {
        return NextResponse.redirect(new URL(`/careers/${careerPostId || ""}?error=1`, request.url), 303);
    }

    const supabase = await createClient();

    const { error } = await supabase.from("job_applications").insert({
        career_post_id: careerPostId,
        applicant_name: applicantName,
        email,
        phone,
        cv_url: cvUrl,
        cover_letter: coverLetter || null,
        status: "received",
    });

    if (error) {
        return NextResponse.redirect(new URL(`/careers/${careerPostId}?error=1`, request.url), 303);
    }

    return NextResponse.redirect(new URL(`/careers/${careerPostId}?submitted=1`, request.url), 303);
}
