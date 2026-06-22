"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Upload,
    Trash2,
    GripVertical,
    ImagePlus,
    Loader2,
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface HeroSlide {
    imageUrl: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
}

interface HeroSlidesManagerProps {
    slides: HeroSlide[];
    onChange: (slides: HeroSlide[]) => void;
}

/** Converts a raw Cloudinary URL to an optimized one with f_auto,q_auto */
function optimizeCloudinaryUrl(url: string): string {
    if (!url.includes("res.cloudinary.com")) return url;
    // Insert f_auto,q_auto after /upload/ if not already present
    if (url.includes("/f_auto") || url.includes("/q_auto")) return url;
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
}

/** Extract public_id from a Cloudinary URL for deletion */
function extractPublicId(url: string): string | null {
    try {
        const urlObj = new URL(url);
        const match = urlObj.pathname.match(/\/upload\/(?:(?:f_auto|q_auto|w_\d+|h_\d+|c_\w+)[,/])*(?:v\d+\/)?(.+?)(?:\.[^./]+)?$/);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

export default function HeroSlidesManager({
    slides,
    onChange,
}: HeroSlidesManagerProps) {
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const uploadToCloudinary = useCallback(
        async (file: File) => {
            setUploading(true);
            try {
                // 1. Get a signed upload signature from our API
                const signRes = await fetch("/api/admin/cloudinary-sign", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        folder: "alnasirmotors/hero",
                        resourceType: "image",
                    }),
                });

                if (!signRes.ok) {
                    throw new Error("Failed to get upload signature");
                }

                const {
                    signature,
                    timestamp,
                    api_key,
                    cloud_name,
                    folder,
                } = await signRes.json();

                // 2. Upload directly to Cloudinary
                const formData = new FormData();
                formData.append("file", file);
                formData.append("signature", signature);
                formData.append("timestamp", String(timestamp));
                formData.append("api_key", api_key);
                formData.append("folder", folder);

                const uploadRes = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
                    { method: "POST", body: formData }
                );

                if (!uploadRes.ok) {
                    throw new Error("Cloudinary upload failed");
                }

                const result = await uploadRes.json();
                const optimizedUrl = optimizeCloudinaryUrl(result.secure_url);

                // 3. Add the new slide
                const newSlide: HeroSlide = {
                    imageUrl: optimizedUrl,
                    title: "",
                    subtitle: "",
                    ctaText: "",
                    ctaLink: "",
                };

                onChange([...slides, newSlide]);
                toast({ title: "Image uploaded successfully" });
            } catch (err) {
                console.error("Upload error:", err);
                toast({
                    title: "Upload failed",
                    description:
                        err instanceof Error
                            ? err.message
                            : "Could not upload image",
                    variant: "destructive",
                });
            } finally {
                setUploading(false);
            }
        },
        [slides, onChange]
    );

    const handleFileSelect = useCallback(
        (files: FileList | null) => {
            if (!files || files.length === 0) return;
            const file = files[0];
            if (!file.type.startsWith("image/")) {
                toast({
                    title: "Invalid file type",
                    description: "Please upload an image file (JPG, PNG, WebP)",
                    variant: "destructive",
                });
                return;
            }
            uploadToCloudinary(file);
        },
        [uploadToCloudinary]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            handleFileSelect(e.dataTransfer.files);
        },
        [handleFileSelect]
    );

    const deleteSlide = useCallback(
        async (index: number) => {
            const slide = slides[index];
            const confirmed = window.confirm(
                "Remove this hero image? This will also delete it from Cloudinary."
            );
            if (!confirmed) return;

            setDeleting(index);

            // Try to delete from Cloudinary
            const publicId = extractPublicId(slide.imageUrl);
            if (publicId) {
                try {
                    await fetch("/api/admin/cloudinary-delete", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            public_id: publicId,
                            resource_type: "image",
                        }),
                    });
                } catch {
                    // Don't block removal from slides if Cloudinary delete fails
                    console.warn(
                        "Cloudinary delete failed for:",
                        publicId
                    );
                }
            }

            const updated = slides.filter((_, i) => i !== index);
            onChange(updated);
            setDeleting(null);
            toast({ title: "Slide removed" });
        },
        [slides, onChange]
    );

    const moveSlide = useCallback(
        (index: number, direction: "up" | "down") => {
            const newIndex = direction === "up" ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= slides.length) return;
            const updated = [...slides];
            [updated[index], updated[newIndex]] = [
                updated[newIndex],
                updated[index],
            ];
            onChange(updated);
        },
        [slides, onChange]
    );

    const updateSlideField = useCallback(
        (index: number, field: keyof HeroSlide, value: string) => {
            const updated = [...slides];
            updated[index] = { ...updated[index], [field]: value };
            onChange(updated);
        },
        [slides, onChange]
    );

    return (
        <div className="space-y-4">
            {/* Existing slides */}
            {slides.length > 0 && (
                <div className="space-y-3">
                    {slides.map((slide, index) => (
                        <div
                            key={`${slide.imageUrl}-${index}`}
                            className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-colors hover:border-white/[0.12]"
                        >
                            <div className="flex flex-col sm:flex-row gap-3 p-3">
                                {/* Reorder, preview, and mobile actions wrapper */}
                                <div className="flex items-center justify-between gap-3 sm:justify-start">
                                    <div className="flex items-center gap-3">
                                        {/* Drag handle + reorder */}
                                        <div className="flex flex-row sm:flex-col items-center justify-center gap-1.5 text-white/20">
                                            <GripVertical className="w-4 h-4" />
                                            <div className="flex sm:flex-col gap-1">
                                                <button
                                                    onClick={() =>
                                                        moveSlide(index, "up")
                                                    }
                                                    disabled={index === 0}
                                                    className="p-0.5 rounded hover:bg-white/10 disabled:opacity-20 transition-colors"
                                                    title="Move up"
                                                >
                                                    <ChevronUp className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        moveSlide(index, "down")
                                                    }
                                                    disabled={
                                                        index === slides.length - 1
                                                    }
                                                    className="p-0.5 rounded hover:bg-white/10 disabled:opacity-20 transition-colors"
                                                    title="Move down"
                                                >
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Image preview */}
                                        <div className="relative w-32 h-18 sm:w-36 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-black/30">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={slide.imageUrl}
                                                alt={
                                                    slide.title ||
                                                    `Slide ${index + 1}`
                                                }
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                                                {index + 1}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delete button (visible on mobile only) */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteSlide(index)}
                                        disabled={deleting === index}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0 sm:hidden"
                                        title="Remove slide"
                                    >
                                        {deleting === index ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>

                                {/* Fields */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                                    <Input
                                        placeholder="Title (optional)"
                                        value={slide.title}
                                        onChange={(e) =>
                                            updateSlideField(
                                                index,
                                                "title",
                                                e.target.value
                                            )
                                        }
                                        className="h-8 text-xs bg-white/[0.02] border-white/[0.08]"
                                    />
                                    <Input
                                        placeholder="Subtitle (optional)"
                                        value={slide.subtitle}
                                        onChange={(e) =>
                                            updateSlideField(
                                                index,
                                                "subtitle",
                                                e.target.value
                                            )
                                        }
                                        className="h-8 text-xs bg-white/[0.02] border-white/[0.08]"
                                    />
                                    <Input
                                        placeholder="CTA Text (optional)"
                                        value={slide.ctaText}
                                        onChange={(e) =>
                                            updateSlideField(
                                                index,
                                                "ctaText",
                                                e.target.value
                                            )
                                        }
                                        className="h-8 text-xs bg-white/[0.02] border-white/[0.08]"
                                    />
                                    <Input
                                        placeholder="CTA Link (optional)"
                                        value={slide.ctaLink}
                                        onChange={(e) =>
                                            updateSlideField(
                                                index,
                                                "ctaLink",
                                                e.target.value
                                            )
                                        }
                                        className="h-8 text-xs bg-white/[0.02] border-white/[0.08]"
                                    />
                                </div>

                                {/* Delete button (visible on desktop/tablet only) */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteSlide(index)}
                                    disabled={deleting === index}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0 self-center hidden sm:flex"
                                    title="Remove slide"
                                >
                                    {deleting === index ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload zone */}
            <div
                className={`relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
                    dragOver
                        ? "border-accent bg-accent/10"
                        : "border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.02]"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                    {uploading ? (
                        <>
                            <Loader2 className="w-8 h-8 text-accent animate-spin" />
                            <p className="text-sm text-white/60">
                                Uploading to Cloudinary...
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                                <ImagePlus className="w-5 h-5 text-accent" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-white/70">
                                    Drag & drop an image here, or{" "}
                                    <span className="text-accent">
                                        click to browse
                                    </span>
                                </p>
                                <p className="text-xs text-white/40 mt-1">
                                    JPG, PNG, WebP • Auto-optimized via
                                    Cloudinary CDN
                                </p>
                            </div>
                        </>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    disabled={uploading}
                />
            </div>

            {slides.length === 0 && (
                <p className="text-xs text-white/30 text-center italic">
                    No hero slides yet. Upload your first image above.
                </p>
            )}
        </div>
    );
}
