import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { sendCareerApplicationConfirmation } from "@/lib/notifications/careerApplicationConfirmation";

const safeTrim = (value: FormDataEntryValue | null) =>
    typeof value === "string" ? value.trim() : "";

export async function POST(request: Request) {
    const form = await request.formData();

    const careerPostId = safeTrim(form.get("career_post_id"));
    const applicantName = safeTrim(form.get("applicant_name"));
    const email = safeTrim(form.get("email"));
    const phone = safeTrim(form.get("phone"));
    let cvUrl = safeTrim(form.get("cv_url"));
    const coverLetter = safeTrim(form.get("cover_letter"));
    const cvFile = form.get("cv_file");
    const supabase = await createClient();

    const { data: job } = await supabase
        .from("career_posts")
        .select("title, location")
        .eq("id", careerPostId)
        .eq("is_active", true)
        .single();

    if (!job) {
        return NextResponse.redirect(new URL(`/careers/${careerPostId || ""}?error=1`, request.url), 303);
    }

    const normalizedEmail = email.toLowerCase();
    const { data: existingApplication, error: duplicateLookupError } = await supabase
        .from("job_applications")
        .select("id")
        .eq("career_post_id", careerPostId)
        .ilike("email", normalizedEmail)
        .limit(1)
        .maybeSingle();

    if (duplicateLookupError) {
        return NextResponse.redirect(new URL(`/careers/${careerPostId || ""}?error=1`, request.url), 303);
    }

    if (existingApplication) {
        return NextResponse.redirect(new URL(`/careers/${careerPostId || ""}?duplicate=1`, request.url), 303);
    }

    if (!cvUrl && cvFile instanceof File && cvFile.size > 0) {
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!serviceRoleKey) {
            return NextResponse.redirect(new URL(`/careers/${careerPostId || ""}?error=1`, request.url), 303);
        }

        const adminClient = createServiceClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceRoleKey,
            { auth: { autoRefreshToken: false, persistSession: false } }
        );

        const safeName = cvFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const uploadPath = `careers/cv/${careerPostId}/${Date.now()}-${safeName}`;
        const fileBuffer = await cvFile.arrayBuffer();

        const { error: uploadError } = await adminClient.storage
            .from("images")
            .upload(uploadPath, new Uint8Array(fileBuffer), {
                contentType: cvFile.type || "application/octet-stream",
                upsert: false,
            });

        if (uploadError) {
            return NextResponse.redirect(new URL(`/careers/${careerPostId || ""}?error=1`, request.url), 303);
        }

        cvUrl = adminClient.storage.from("images").getPublicUrl(uploadPath).data.publicUrl;
    }

    if (!careerPostId || !applicantName || !email || !phone || !cvUrl) {
        return NextResponse.redirect(new URL(`/careers/${careerPostId || ""}?error=1`, request.url), 303);
    }

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

    if (job) {
        await sendCareerApplicationConfirmation({
            applicantName,
            applicantEmail: email,
            jobTitle: job.title,
            jobLocation: job.location,
        });
    }

    return NextResponse.redirect(new URL(`/careers/${careerPostId}?submitted=1`, request.url), 303);
}
