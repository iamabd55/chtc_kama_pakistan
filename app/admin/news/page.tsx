"use client";
import Image from 'next/image';
import { useEffect, useRef, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminDb } from "@/lib/supabase/adminClient";
import { Plus, Pencil, Trash2, Search, Upload, ImageIcon, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { NewsPost } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";

const newsCategories = [
    "news",
    "event",
    "product-launch",
    "press-release",
] as const;

const STORAGE_BUCKET = "images";

/* Auto-generate slug from title (used internally, never shown to user) */
const toSlug = (value: string): string =>
    value
        .toLowerCase()
        .trim()
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
        } catch {
            return null;
        }
    }
    const cleaned = value.replace(/^\/+/, "");
    if (cleaned.startsWith(`${STORAGE_BUCKET}/`)) {
        return cleaned.slice(STORAGE_BUCKET.length + 1);
    }
    return cleaned;
};

const isIgnorableStorageRemoveError = (message: string) =>
    /not found|no such key|does not exist/i.test(message);

type ProductOption = {
    id: string;
    name: string;
    slug: string;
    category:
        | { name: string; slug: string; }
        | Array<{ name: string; slug: string; }>
        | null;
};

const getProductCategoryName = (product: ProductOption): string | null => {
    const category = product.category;
    if (!category) return null;
    if (Array.isArray(category)) return category[0]?.name || null;
    return category.name || null;
};

const AdminNews = () => {
    const [posts, setPosts] = useState<NewsPost[]>([]);
    const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<NewsPost> | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploadingThumb, setUploadingThumb] = useState(false);
    const [draggingThumb, setDraggingThumb] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const fetchData = async () => {
        setLoading(true);
        const [{ data: newsData }, { data: productsData }] = await Promise.all([
            adminDb
                .from("news_posts")
                .select("*")
                .order("created_at", { ascending: false }),
            adminDb
                .from("products")
                .select("id, name, slug, category:categories(name, slug)")
                .eq("is_active", true)
                .neq("brand", "joylong")
                .order("name", { ascending: true }),
        ]);
        setPosts((newsData as NewsPost[]) || []);
        setProductOptions((productsData as ProductOption[]) || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filtered = posts.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

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
        });
        setDialogOpen(true);
    };

    const openEdit = (p: NewsPost) => {
        setEditing({ ...p });
        setDialogOpen(true);
    };

    /* Always publishes — no draft concept exposed to admin */
    const handlePublish = async () => {
        if (
            !editing?.title ||
            !editing?.content ||
            !editing?.thumbnail
        ) {
            toast({ title: "Missing fields", description: "Title, thumbnail and content are required.", variant: "destructive" });
            return;
        }
        setSaving(true);

        /* Auto-generate slug from title; ensure uniqueness with timestamp */
        const baseSlug = toSlug(editing.title);
        const slug = editing.id
            ? (editing.slug || baseSlug)
            : `${baseSlug}-${Date.now()}`;

        const payload = {
            title: editing.title,
            slug,
            content: editing.content,
            excerpt: null,
            category: editing.category || "news",
            thumbnail: editing.thumbnail,
            author: editing.author || "Al Nasir Motors Pakistan",
            tags: [],
            related_product_id: editing.related_product_id || null,
            status: "published" as const,
            meta_title: null,
            meta_desc: null,
            published_at: editing.published_at || new Date().toISOString(),
        };

        const previousThumbnail = editing.id
            ? posts.find((post) => post.id === editing.id)?.thumbnail || null
            : null;

        if (editing.id) {
            const { error } = await adminDb
                .from("news_posts")
                .update(payload)
                .eq("id", editing.id);
            if (error) {
                toast({ title: "Error", description: error.message, variant: "destructive" });
            } else {
                const previousPath = extractStoragePath(previousThumbnail);
                const nextPath = extractStoragePath(payload.thumbnail || "");
                if (previousPath && nextPath && previousPath !== nextPath) {
                    const { error: removeError } = await adminDb.storage
                        .from(STORAGE_BUCKET)
                        .remove([previousPath]);
                    if (removeError && !isIgnorableStorageRemoveError(removeError.message)) {
                        toast({ title: "Post updated", description: "Old thumbnail could not be removed." });
                    }
                }
                toast({ title: "Post updated & published ✓" });
            }
        } else {
            const { error } = await adminDb.from("news_posts").insert(payload);
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else
                toast({ title: "Post published ✓" });
        }
        setSaving(false);
        setDialogOpen(false);
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this post?")) return;
        const post = posts.find((item) => item.id === id);
        const storagePath = extractStoragePath(post?.thumbnail);
        if (storagePath) {
            const { error: removeError } = await adminDb.storage
                .from(STORAGE_BUCKET)
                .remove([storagePath]);
            if (removeError && !isIgnorableStorageRemoveError(removeError.message)) {
                toast({ title: "Error", description: `Thumbnail cleanup failed: ${removeError.message}`, variant: "destructive" });
                return;
            }
        }
        const { error } = await adminDb.from("news_posts").delete().eq("id", id);
        if (error)
            toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            toast({ title: "Post deleted" });
            fetchData();
        }
    };

    const uploadThumbnail = async (file: File) => {
        if (!editing) return;
        if (!file.type.startsWith("image/")) {
            toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" });
            return;
        }
        setUploadingThumb(true);
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const safeBase = toSlug(file.name.replace(/\.[^/.]+$/, "")) || "thumbnail";
        const unique =
            typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const path = `news/${Date.now()}-${unique}-${safeBase}.${extension}`;
        const { error } = await adminDb.storage
            .from(STORAGE_BUCKET)
            .upload(path, file, { cacheControl: "3600", upsert: false });
        setUploadingThumb(false);
        if (error) {
            toast({ title: "Upload failed", description: error.message, variant: "destructive" });
            return;
        }
        setEditing({ ...editing, thumbnail: path });
        toast({ title: "Thumbnail uploaded ✓" });
    };

    const columns = [
        {
            header: "Post",
            accessor: (r: NewsPost) => (
                <div className="flex items-center gap-3">
                    <Image
                        src={getStorageUrl(r.thumbnail)}
                        alt={r.title}
                        className="w-14 h-10 rounded-lg object-cover bg-muted"
                        width={800} height={600} loading="lazy"
                    />
                    <div>
                        <p className="font-medium line-clamp-1">{r.title}</p>
                        <p className="text-xs text-white/40 capitalize">
                            {r.category.replace("-", " ")}
                        </p>
                    </div>
                </div>
            ),
        },
        { header: "Author", accessor: "author" as keyof NewsPost },
        {
            header: "Status",
            accessor: (r: NewsPost) => <StatusBadge status={r.status} />,
        },
        {
            header: "Date",
            accessor: (r: NewsPost) => (
                <span className="text-sm text-white/40">
                    {new Date(r.created_at).toLocaleDateString()}
                </span>
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
                <Input
                    placeholder="Search posts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            <DataTable columns={columns} data={filtered} loading={loading} />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-display flex items-center gap-2">
                            <Send className="w-4 h-4 text-[#e07a2f]" />
                            {editing?.id ? "Edit Post" : "New Post"}
                        </DialogTitle>
                    </DialogHeader>

                    {editing && (
                        <div className="space-y-4 mt-2">
                            {/* Title */}
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

                            {/* Category + Related Product */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                                        Category
                                    </label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={editing.category || "news"}
                                        onChange={(e) =>
                                            setEditing({ ...editing, category: e.target.value as NewsPost["category"] })
                                        }
                                    >
                                        {newsCategories.map((c) => (
                                            <option key={c} value={c} className="capitalize">
                                                {c.replace("-", " ")}
                                            </option>
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
                                        onChange={(e) =>
                                            setEditing({ ...editing, related_product_id: e.target.value || null })
                                        }
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

                            {/* Author */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                                    Author
                                </label>
                                <Input
                                    value={editing.author || ""}
                                    onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                                />
                            </div>

                            {/* Thumbnail */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                                    Thumbnail <span className="text-[#e07a2f]">*</span>
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
                                        e.preventDefault();
                                        setDraggingThumb(false);
                                        const file = e.dataTransfer.files?.[0];
                                        if (file) void uploadThumbnail(file);
                                    }}
                                    className={`rounded-lg border-2 border-dashed p-5 transition-colors ${draggingThumb
                                        ? "border-[#e07a2f] bg-[#e07a2f]/5"
                                        : "border-white/[0.06] bg-white/[0.04]"
                                        }`}
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-md bg-[#171b26] border border-white/[0.06] flex items-center justify-center">
                                                <Upload className="w-4 h-4 text-white/40" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white/85">Drag & drop image here</p>
                                                <p className="text-xs text-white/40">or choose from your computer</p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploadingThumb}
                                        >
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
                                                className="mt-3 w-full max-h-52 object-cover rounded-md border border-white/[0.06] bg-[#171b26]"
                                                width={800} height={600} loading="lazy"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
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

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handlePublish}
                                    disabled={saving}
                                    className="bg-[#e07a2f] hover:bg-[#c96a25] font-semibold min-w-[120px]"
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
