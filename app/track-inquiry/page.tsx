import TrackInquiryForm from "@/components/inquiries/TrackInquiryForm";

interface TrackInquiryPageProps {
    searchParams?: Promise<{
        ref?: string;
    }>;
}

export default async function TrackInquiryPage({ searchParams }: TrackInquiryPageProps) {
    const resolved = searchParams ? await searchParams : undefined;
    const initialRef = resolved?.ref?.trim() ?? "";

    return (
        <>
            <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,134,34,0.14),_transparent_36%),linear-gradient(135deg,#021b33_0%,#013466_55%,#0153a8_100%)] py-16 md:py-20">
                <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:70px_70px]" />
                <div className="container relative text-center text-white">
                    <p className="mb-3 text-[11px] font-display font-semibold uppercase tracking-[0.28em] text-[#FFBB82]">
                        Customer status lookup
                    </p>
                    <h1 className="text-4xl font-display font-bold md:text-5xl">Track Inquiry</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/72 md:text-base">
                        Use your reference number to check where your inquiry stands. No login required.
                    </p>
                </div>
            </section>

            <section className="bg-[linear-gradient(180deg,#f8fafc_0%,#eef4fb_100%)] py-16 md:py-20">
                <div className="container">
                    <TrackInquiryForm initialRef={initialRef} />
                </div>
            </section>
        </>
    );
}
