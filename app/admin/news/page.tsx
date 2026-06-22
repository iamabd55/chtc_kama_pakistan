"use client";
import Image from 'next/image';
import { useEffect, useRef, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminDb } from "@/lib/supabase/adminClient";
import {
    Plus, Pencil, Trash2, Search, Upload, ImageIcon,
    Send, Video, X, FileVideo, Image as ImageLucide, AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { NewsPost } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";

// ─── Constants ────────────────────────────────────────────────────────────────
const newsCategories = ["news", "event", "product-launch", "press-release"] as const;
const STORAGE_BUCKET = "images";
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"];
const MAX_VIDEO_SIZE_MB = 500;

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Extract Cloudinary public_id from a secure_url (client-safe, no Node crypto) */
const extractCloudinaryPublicId = (secureUrl: string): string | null => {
    try {
        const url = new URL(secureUrl);
        const match = url.pathname.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^./]+)?$/);
        return match ? match[1] : null;
    } catch {
        return null;
    }
};

const toSlug = (value: string): string =>
    value.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

const extractStoragePath = (value: string | null | undefined): string | null => {
    if (!value) return null;
    if (/^https?:\/\//i.test(value)) {
        try {
            const url = new URL(value);
            const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
            const idx = url.pathname.indexOf(marker);
            if (idx === -1) return null;
            return decodeURIComponent(url.pathname.slice(idx + marker.length));
        } catch { return null; }
    }
    const cleaned = value.replace(/^\/+/, "");
    if (cleaned.startsWith(`${STORAGE_BUCKET}/`)) return cleaned.slice(STORAGE_BUCKET.length + 1);
    return cleaned;
};

const isIgnorableStorageRemoveError = (message: string) =>
    /not found|no such key|does not exist/i.test(message);

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ─── Types ────────────────────────────────────────────────────────────────────
type PostType = "image" | "video";

type ProductOption = {
    id: string;
    name: string;
    slug: string;
    category: { name: string; slug: string } | Array<{ name: string; slug: string }> | null;
};

const getProductCategoryName = (product: ProductOption): string | null => {
    const category = product.category;
    if (!category) return null;
    if (Array.isArray(category)) return category[0]?.name || null;
    return category.name || null;
};

// ─── Cloudinary direct-upload helper ─────────────────────────────────────────
async function uploadVideoToCloudinary(
    file: File,
    onProgress: (pct: number) => void
): Promise<{ secure_url: string; public_id: string }> {
    // 1. Get a server-side signature
    const signRes = await fetch("/api/admin/cloudinary-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "news-videos", resourceType: "video" }),
    });
    if (!signRes.ok) throw new Error("Failed to get upload signature");
    const { signature, timestamp, api_key, cloud_name, folder } = await signRes.json();

    // 2. Upload directly to Cloudinary (XHR for progress)
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", api_key);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append("folder", folder);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try { resolve(JSON.parse(xhr.responseText)); }
                catch { reject(new Error("Invalid Cloudinary response")); }
            } else {
                reject(new Error(`Cloudinary upload failed: ${xhr.status}`));
            }
        });
        xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`);
        xhr.send(formData);
    });
}

// ─── Delete Cloudinary video helper ──────────────────────────────────────────
async function deleteCloudinaryVideo(videoUrl: string) {
    const publicId = extractCloudinaryPublicId(videoUrl);
    if (!publicId) return;
    await fetch("/api/admin/cloudinary-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId, resource_type: "video" }),
    });
}

// ─── Component ────────────────────────────────────────────────────────────────
const AdminNews = () => {
    const [posts, setPosts] = useState<NewsPost[]>([]);
    const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<NewsPost> | null>(null);
    const [postType, setPostType] = useState<PostType>("image");
    const [saving, setSaving] = useState(false);

    // Thumbnail (image) upload state
    const [uploadingThumb, setUploadingThumb] = useState(false);
    const [draggingThumb, setDraggingThumb] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Video upload state
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);
    const [draggingVideo, setDraggingVideo] = useState(false);
    const [videoFileName, setVideoFileName] = useState<string | null>(null);
    const [videoFileSize, setVideoFileSize] = useState<string | null>(null);
    const videoInputRef = useRef<HTMLInputElement | null>(null);

    const fetchData = async () => {
        setLoading(true);
        const [{ data: newsData }, { data: productsData }] = await Promise.all([
            adminDb.from("news_posts").select("*").order("created_at", { ascending: false }),
            adminDb.from("products")
                .select("id, name, slug, category:categories(name, slug)")
                .eq("is_active", true).neq("brand", "joylong")
                .order("name", { ascending: true }),
        ]);
        setPosts((newsData as NewsPost[]) || []);
        setProductOptions((productsData as ProductOption[]) || []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const filtered = posts.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    // ── Open dialog helpers ───────────────────────────────────────────────────
    const openNew = () => {
        setEditing({
            category: "news",
            status: "published",
            tags: [],
            author: "Al Nasir Motors Pakistan",
            related_product_id: null,
            excerpt: null,
            meta_title: null,
            meta_desc: null,
            video_url: null,
        });
        setPostType("image");
        setVideoFileName(null);
        setVideoFileSize(null);
        setVideoProgress(0);
        setDialogOpen(true);
    };

    const openEdit = (p: NewsPost) => {
        setEditing({ ...p });
        setPostType(p.video_url ? "video" : "image");
        setVideoFileName(p.video_url ? "Existing video" : null);
        setVideoFileSize(null);
        setVideoProgress(0);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setVideoFileName(null);
        setVideoFileSize(null);
        setVideoProgress(0);
    };

    // ── Thumbnail upload (Supabase Storage) ──────────────────────────────────
    const uploadThumbnail = async (file: File) => {
        if (!editing) return;
        if (!file.type.startsWith("image/")) {
            toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" });
            return;
        }
        setUploadingThumb(true);
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const safeBase = toSlug(file.name.replace(/\.[^/.]+$/, "")) || "thumbnail";
        const unique = crypto.randomUUID?.() ?? `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const path = `news/${Date.now()}-${unique}-${safeBase}.${extension}`;
        const { error } = await adminDb.storage.from(STORAGE_BUCKET).upload(path, file, { cacheControl: "3600", upsert: false });
        setUploadingThumb(false);
        if (error) {
            toast({ title: "Upload failed", description: error.message, variant: "destructive" });
            return;
        }
        setEditing((prev) => ({ ...prev, thumbnail: path }));
        toast({ title: "Thumbnail uploaded ✓" });
    };

    // ── Video upload (Cloudinary) ─────────────────────────────────────────────
    const uploadVideo = async (file: File) => {
        if (!editing) return;
        if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
            toast({ title: "Invalid file type", description: "Please upload a .mp4, .mov, or .webm video.", variant: "destructive" });
            return;
        }
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > MAX_VIDEO_SIZE_MB) {
            toast({ title: "File too large", description: `Max allowed size is ${MAX_VIDEO_SIZE_MB} MB.`, variant: "destructive" });
            return;
        }

        setVideoFileName(file.name);
        setVideoFileSize(formatFileSize(file.size));
        setUploadingVideo(true);
        setVideoProgress(0);

        try {
            const result = await uploadVideoToCloudinary(file, (pct) => setVideoProgress(pct));
            setEditing((prev) => ({ ...prev, video_url: result.secure_url }));
            toast({ title: "Video uploaded to Cloudinary ✓" });
        } catch (err) {
            toast({ title: "Video upload failed", description: (err as Error).message, variant: "destructive" });
            setVideoFileName(null);
            setVideoFileSize(null);
        } finally {
            setUploadingVideo(false);
        }
    };

    const removeVideo = () => {
        setEditing((prev) => ({ ...prev, video_url: null }));
        setVideoFileName(null);
        setVideoFileSize(null);
        setVideoProgress(0);
        if (videoInputRef.current) videoInputRef.current.value = "";
    };

    // ── Save / Publish ────────────────────────────────────────────────────────
    const handlePublish = async () => {
        if (!editing?.title || !editing?.content) {
            toast({ title: "Missing fields", description: "Title and content are required.", variant: "destructive" });
            return;
        }
        if (postType === "image" && !editing?.thumbnail) {
            toast({ title: "Missing thumbnail", description: "An image post requires a thumbnail.", variant: "destructive" });
            return;
        }
        if (postType === "video" && !editing?.video_url) {
            toast({ title: "Missing video", description: "Please upload a video.", variant: "destructive" });
            return;
        }

        setSaving(true);
        const baseSlug = toSlug(editing.title!);
        const slug = editing.id ? (editing.slug || baseSlug) : `${baseSlug}-${Date.now()}`;

        const payload = {
            title: editing.title,
            slug,
            content: editing.content,
            excerpt: null,
            category: editing.category || "news",
            thumbnail: editing.thumbnail || "",
            video_url: postType === "video" ? (editing.video_url || null) : null,
            author: editing.author || "Al Nasir Motors Pakistan",
            tags: [],
            related_product_id: editing.related_product_id || null,
            status: "published" as const,
            meta_title: null,
            meta_desc: null,
            published_at: editing.published_at || new Date().toISOString(),
        };

        const previousThumbnail = editing.id ? posts.find((p) => p.id === editing.id)?.thumbnail || null : null;
        const previousVideo = editing.id ? posts.find((p) => p.id === editing.id)?.video_url || null : null;

        if (editing.id) {
            const { error } = await adminDb.from("news_posts").update(payload).eq("id", editing.id);
            if (error) {
                toast({ title: "Error", description: error.message, variant: "destructive" });
            } else {
                // Cleanup old thumbnail if replaced
                const prevPath = extractStoragePath(previousThumbnail);
                const nextPath = extractStoragePath(payload.thumbnail);
                if (prevPath && nextPath && prevPath !== nextPath) {
                    const { error: rmErr } = await adminDb.storage.from(STORAGE_BUCKET).remove([prevPath]);
                    if (rmErr && !isIgnorableStorageRemoveError(rmErr.message)) {
                        toast({ title: "Post updated", description: "Old thumbnail could not be removed." });
                    }
                }
                // Cleanup old Cloudinary video if replaced
                if (previousVideo && previousVideo !== payload.video_url) {
                    await deleteCloudinaryVideo(previousVideo);
                }
                toast({ title: "Post updated & published ✓" });
            }
        } else {
            const { error } = await adminDb.from("news_posts").insert(payload);
            if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
            else toast({ title: "Post published ✓" });
        }

        setSaving(false);
        handleCloseDialog();
        fetchData();
    };

    // ── Delete post ───────────────────────────────────────────────────────────
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this post? This cannot be undone.")) return;
        const post = posts.find((item) => item.id === id);

        // Cleanup Cloudinary video
        if (post?.video_url) await deleteCloudinaryVideo(post.video_url);

        // Cleanup Supabase thumbnail
        const storagePath = extractStoragePath(post?.thumbnail);
        if (storagePath) {
            const { error: rmErr } = await adminDb.storage.from(STORAGE_BUCKET).remove([storagePath]);
            if (rmErr && !isIgnorableStorageRemoveError(rmErr.message)) {
                toast({ title: "Error", description: `Thumbnail cleanup failed: ${rmErr.message}`, variant: "destructive" });
                return;
            }
        }

        const { error } = await adminDb.from("news_posts").delete().eq("id", id);
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else { toast({ title: "Post deleted" }); fetchData(); }
    };

    // ── Table columns ─────────────────────────────────────────────────────────
    const columns = [
        {
            header: "Post",
            accessor: (r: NewsPost) => (
                <div className="flex items-center gap-3">
                    <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {r.video_url && !r.thumbnail ? (
                            <div className="w-full h-full flex items-center justify-center bg-[#1a1f2e]">
                                <FileVideo className="w-5 h-5 text-[#e07a2f]" />
                            </div>
                        ) : (
                            <Image
                                src={getStorageUrl(r.thumbnail)}
                                alt={r.title}
                                className="object-cover"
                                fill sizes="56px" loading="lazy"
                            />
                        )}
                        {r.video_url && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <Video className="w-3.5 h-3.5 text-white" />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-medium line-clamp-1">{r.title}</p>
                        <p className="text-xs text-white/40 capitalize flex items-center gap-1">
                            {r.video_url && <Video className="w-3 h-3 text-[#e07a2f]" />}
                            {r.category.replace("-", " ")}
                        </p>
                    </div>
                </div>
            ),
        },
        { header: "Author", accessor: "author" as keyof NewsPost },
        { header: "Status", accessor: (r: NewsPost) => <StatusBadge status={r.status} /> },
        {
            header: "Date",
            accessor: (r: NewsPost) => (
                <span className="text-sm text-white/40">{new Date(r.created_at).toLocaleDateString()}</span>
            ),
        },
        {
            header: "Actions",
            accessor: (r: NewsPost) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); openEdit(r); }}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
            className: "w-[100px]",
        },
    ];

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <AdminLayout
            title="News & Posts"
            subtitle={`${posts.length} posts`}
            actions={
                <Button onClick={openNew} className="font-display font-semibold bg-[#e07a2f] hover:bg-[#c96a25]">
                    <Plus className="w-4 h-4 mr-2" /> New Post
                </Button>
            }
        >
            <div className="mb-6 max-w-sm relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>

            <DataTable columns={columns} data={filtered} loading={loading} />

            {/* ── Create / Edit dialog ── */}
            <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) handleCloseDialog(); }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-display flex items-center gap-2">
                            <Send className="w-4 h-4 text-[#e07a2f]" />
                            {editing?.id ? "Edit Post" : "New Post"}
                        </DialogTitle>
                    </DialogHeader>

                    {editing && (
                        <div className="space-y-5 mt-2">

                            {/* ── Post type selector ── */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                                    Post Type
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(["image", "video"] as PostType[]).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setPostType(type)}
                                            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                                                postType === type
                                                    ? "border-[#e07a2f] bg-[#e07a2f]/10"
                                                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                                            }`}
                                        >
                                            {type === "image"
                                                ? <ImageLucide className={`w-5 h-5 ${postType === type ? "text-[#e07a2f]" : "text-white/40"}`} />
                                                : <FileVideo className={`w-5 h-5 ${postType === type ? "text-[#e07a2f]" : "text-white/40"}`} />
                                            }
                                            <div className="text-left">
                                                <p className={`text-sm font-semibold ${postType === type ? "text-white" : "text-white/60"}`}>
                                                    {type === "image" ? "Image Post" : "Video Post"}
                                                </p>
                                                <p className="text-xs text-white/30">
                                                    {type === "image" ? "Thumbnail required" : "Video via Cloudinary"}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ── Title ── */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                                    Title <span className="text-[#e07a2f]">*</span>
                                </label>
                                <Input
                                    placeholder="e.g. KAMA SP6 Launches in Pakistan"
                                    value={editing.title || ""}
                                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                                />
                            </div>

                            {/* ── Category + Related Product ── */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Category</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={editing.category || "news"}
                                        onChange={(e) => setEditing({ ...editing, category: e.target.value as NewsPost["category"] })}
                                    >
                                        {newsCategories.map((c) => (
                                            <option key={c} value={c} className="capitalize">{c.replace("-", " ")}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                                        Related Product <span className="font-normal normal-case text-white/25">(optional)</span>
                                    </label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={editing.related_product_id || ""}
                                        onChange={(e) => setEditing({ ...editing, related_product_id: e.target.value || null })}
                                    >
                                        <option value="">None</option>
                                        {productOptions.map((product) => {
                                            const categoryName = getProductCategoryName(product);
                                            return (
                                                <option key={product.id} value={product.id}>
                                                    {product.name}{categoryName ? ` (${categoryName})` : ""}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>

                            {/* ── Author ── */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Author</label>
                                <Input
                                    value={editing.author || ""}
                                    onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                                />
                            </div>

                            {/* ── VIDEO UPLOAD ZONE (only for video posts) ── */}
                            {postType === "video" && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                                        Video File <span className="text-[#e07a2f]">*</span>
                                        <span className="ml-2 font-normal normal-case text-white/25">
                                            MP4 / MOV / WebM — max {MAX_VIDEO_SIZE_MB} MB — uploaded to Cloudinary
                                        </span>
                                    </label>
                                    <input
                                        ref={videoInputRef}
                                        type="file"
                                        accept="video/mp4,video/quicktime,video/webm,.mov,.mp4,.webm"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) void uploadVideo(file);
                                            e.currentTarget.value = "";
                                        }}
                                    />

                                    {/* Upload zone */}
                                    {!editing.video_url ? (
                                        <div
                                            onDragOver={(e) => { e.preventDefault(); setDraggingVideo(true); }}
                                            onDragEnter={(e) => { e.preventDefault(); setDraggingVideo(true); }}
                                            onDragLeave={(e) => { e.preventDefault(); setDraggingVideo(false); }}
                                            onDrop={(e) => {
                                                e.preventDefault(); setDraggingVideo(false);
                                                const file = e.dataTransfer.files?.[0];
                                                if (file) void uploadVideo(file);
                                            }}
                                            className={`rounded-xl border-2 border-dashed p-6 transition-all cursor-pointer ${
                                                draggingVideo
                                                    ? "border-[#e07a2f] bg-[#e07a2f]/8"
                                                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                                            }`}
                                            onClick={() => !uploadingVideo && videoInputRef.current?.click()}
                                        >
                                            {uploadingVideo ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <FileVideo className="w-5 h-5 text-[#e07a2f] flex-shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-white/85 truncate">{videoFileName}</p>
                                                            <p className="text-xs text-white/40">{videoFileSize}</p>
                                                        </div>
                                                        <span className="text-sm font-bold text-[#e07a2f]">{videoProgress}%</span>
                                                    </div>
                                                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="bg-gradient-to-r from-[#e07a2f] to-[#f0a060] h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${videoProgress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-white/40 text-center">
                                                        Uploading to Cloudinary… {videoProgress < 100 ? "please wait" : "processing…"}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3 text-center py-4">
                                                    <div className="w-14 h-14 rounded-xl bg-[#e07a2f]/10 border border-[#e07a2f]/20 flex items-center justify-center">
                                                        <Upload className="w-6 h-6 text-[#e07a2f]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-white/80">Drag & drop your video here</p>
                                                        <p className="text-xs text-white/40 mt-1">or click to browse • MP4, MOV, WebM supported</p>
                                                    </div>
                                                    <Button type="button" variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); videoInputRef.current?.click(); }}>
                                                        Select Video
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        /* Video uploaded — show preview */
                                        <div className="rounded-xl border border-white/[0.08] bg-[#171b26] overflow-hidden">
                                            <video
                                                src={editing.video_url}
                                                controls
                                                preload="metadata"
                                                playsInline
                                                className="w-full max-h-52 bg-black"
                                            />
                                            <div className="p-3 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <FileVideo className="w-4 h-4 text-[#e07a2f] flex-shrink-0" />
                                                    <p className="text-xs text-white/50 truncate">{editing.video_url.split("/").pop()}</p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive flex-shrink-0"
                                                    onClick={removeVideo}
                                                >
                                                    <X className="w-4 h-4 mr-1" /> Remove
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── THUMBNAIL UPLOAD ── */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                                    Thumbnail / Cover Image
                                    {postType === "image" && <span className="text-[#e07a2f] ml-1">*</span>}
                                    {postType === "video" && (
                                        <span className="ml-2 font-normal normal-case text-white/25">
                                            (optional for video posts — video's first frame used if omitted)
                                        </span>
                                    )}
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) void uploadThumbnail(file);
                                        e.currentTarget.value = "";
                                    }}
                                />
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDraggingThumb(true); }}
                                    onDragEnter={(e) => { e.preventDefault(); setDraggingThumb(true); }}
                                    onDragLeave={(e) => { e.preventDefault(); setDraggingThumb(false); }}
                                    onDrop={(e) => {
                                        e.preventDefault(); setDraggingThumb(false);
                                        const file = e.dataTransfer.files?.[0];
                                        if (file) void uploadThumbnail(file);
                                    }}
                                    className={`rounded-lg border-2 border-dashed p-5 transition-colors ${
                                        draggingThumb ? "border-[#e07a2f] bg-[#e07a2f]/5" : "border-white/[0.06] bg-white/[0.04]"
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-md bg-[#171b26] border border-white/[0.06] flex items-center justify-center">
                                                <ImageIcon className="w-4 h-4 text-white/40" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white/85">Drag & drop image here</p>
                                                <p className="text-xs text-white/40">or choose from your computer</p>
                                            </div>
                                        </div>
                                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadingThumb}>
                                            {uploadingThumb ? "Uploading..." : "Select Image"}
                                        </Button>
                                    </div>
                                    {editing.thumbnail && (
                                        <div className="mt-4 rounded-md border border-white/[0.06] bg-[#171b26] p-3">
                                            <div className="flex items-center gap-3">
                                                <ImageIcon className="w-4 h-4 text-white/40" />
                                                <p className="text-xs text-white/40 break-all">{editing.thumbnail}</p>
                                            </div>
                                            <Image
                                                src={getStorageUrl(editing.thumbnail)}
                                                alt="Thumbnail preview"
                                                className="mt-3 w-full max-h-40 object-cover rounded-md border border-white/[0.06] bg-[#171b26]"
                                                width={800} height={400} loading="lazy"
                                            />
                                        </div>
                                    )}
                                </div>
                                {postType === "video" && !editing.thumbnail && (
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-amber-300/80">
                                            No thumbnail set — the video's first frame will be used automatically as the poster image in the listing and on the detail page.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* ── Content ── */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                                    Content <span className="text-[#e07a2f]">*</span>
                                </label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm min-h-[150px] resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Write the full article content here…"
                                    value={editing.content || ""}
                                    onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                                />
                            </div>

                            {/* ── Actions ── */}
                            <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
                                <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                                <Button
                                    onClick={handlePublish}
                                    disabled={saving || uploadingVideo || uploadingThumb}
                                    className="bg-[#e07a2f] hover:bg-[#c96a25] font-semibold min-w-[140px]"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    {saving ? "Publishing…" : editing?.id ? "Update & Publish" : "Publish"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminNews;
