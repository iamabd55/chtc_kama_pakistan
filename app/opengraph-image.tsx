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
                    justifyContent: "space-between",
                    padding: "56px",
                    background: "radial-gradient(circle at 15% 20%, #0b5ed7 0%, #0a3f8f 45%, #092b61 100%)",
                    color: "#ffffff",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: 20,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            opacity: 0.85,
                        }}
                    >
                        Al Nasir Motors Pakistan
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: 74,
                            lineHeight: 1.05,
                            fontWeight: 800,
                            maxWidth: 980,
                        }}
                    >
                        Commercial Vehicles Built For Pakistan
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: 30,
                            maxWidth: 900,
                            lineHeight: 1.25,
                            opacity: 0.92,
                        }}
                    >
                        Mini trucks, light trucks, dumper trucks, EV trucks, buses, and dealer support nationwide.
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            fontSize: 22,
                            opacity: 0.9,
                        }}
                    >
                        <span>Find Dealer</span>
                        <span>•</span>
                        <span>Get Quote</span>
                        <span>•</span>
                        <span>After Sales</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: 20,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            opacity: 0.75,
                        }}
                    >
                        alnasirmotors.com.pk
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
