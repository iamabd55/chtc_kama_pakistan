import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "64px",
                    background: "linear-gradient(135deg, #004a99 0%, #00397a 100%)",
                    color: "#ffffff",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: 24,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        opacity: 0.8,
                        marginBottom: 24,
                    }}
                >
                    CHTC Kama Pakistan
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: 78,
                        fontWeight: 800,
                        lineHeight: 1.05,
                        marginBottom: 18,
                    }}
                >
                    Privacy Policy
                </div>
                <div
                    style={{
                        display: "flex",
                        maxWidth: 920,
                        fontSize: 34,
                        lineHeight: 1.3,
                        opacity: 0.92,
                    }}
                >
                    How we collect, use, and protect your information.
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
