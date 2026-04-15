"use client";
import Image from 'next/image';
import { useEffect, useRef, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminDb } from "@/lib/supabase/adminClient";
import { Plus, Pencil, Trash2, Search, Upload, ImageIcon } from "lucide-react";
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

const serializeTags = (tags?: string[]) => (tags ?? []).join(", ");

const parseTags = (value: string): string[] =>
    value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

const normalizeTags = (value: unknown): string[] => {
    if (Array.isArray(value)) {
        return value.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean);
    }
    if (typeof value === "string") {
        return parseTags(value);
    }
    return [];
};

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
        | {
              name: string;
              slug: string;
          }
        | Array<{
              name: string;
              slug: string;
          }>
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
    const [tagsInput, setTagsInput] = useState("");
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
            status: "draft",
            tags: [],
            author: "Al Nasir Motors Pakistan",
            related_product_id: null,
            excerpt: null,
            meta_title: null,
            meta_desc: null,
        });
        setTagsInput("");
        setDialogOpen(true);
    };
    const openEdit = (p: NewsPost) => {
        setEditing({ ...p });
        setTagsInput(serializeTags(normalizeTags(p.tags)));
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (
            !editing?.title ||
            !editing?.slug ||
            !editing?.content ||
            !editing?.thumbnail
        ) {
            toast({ title: "Missing fields", variant: "destructive" });
            return;
        }
        setSaving(true);
        const payload = {
            title: editing.title,
            slug: editing.slug,
            content: editing.content,
            excerpt: null,
            category: editing.category || "news",
            thumbnail: editing.thumbnail,
            author: editing.author || "Al Nasir Motors Pakistan",
            tags: parseTags(tagsInput),
            related_product_id: editing.related_product_id || null,
            status: editing.status || "draft",
            meta_title: null,
            meta_desc: null,
            published_at:
                editing.status === "published"
                    ? editing.published_at || new Date().toISOString()
                    : null,
        };

        const previousThumbnail = editing.id
            ? posts.find((post) => post.id === editing.id)?.thumbnail || null
            : null;

        if (editing.id) {
            const { error } = await adminDb
                .from("news_posts")
                .update(payload)
                .eq("id", editing.id);
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else {
                const previousPath = extractStoragePath(previousThumbnail);
                const nextPath = extractStoragePath(payload.thumbnail || "");

                if (previousPath && nextPath && previousPath !== nextPath) {
                    const { error: removeError } = await adminDb.storage
                        .from(STORAGE_BUCKET)
                        .remove([previousPath]);

                    if (removeError && !isIgnorableStorageRemoveError(removeError.message)) {
                        toast({
                            title: "Post updated",
                            description: "Old thumbnail could not be removed from storage.",
                        });
                    }
                }

                toast({ title: "Post updated" });
            }
        } else {
            const { error } = await adminDb.from("news_posts").insert(payload);
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else toast({ title: "Post created" });
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
                toast({
                    title: "Error",
                    description: `Thumbnail cleanup failed: ${removeError.message}`,
                    variant: "destructive",
                });
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
            toast({
                title: "Invalid file",
                description: "Please upload an image file.",
                variant: "destructive",
            });
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
            .upload(path, file, {
                cacheControl: "3600",
                upsert: false,
            });

        setUploadingThumb(false);

        if (error) {
            toast({ title: "Upload failed", description: error.message, variant: "destructive" });
            return;
        }

        setEditing({ ...editing, thumbnail: path });
        toast({ title: "Thumbnail uploaded" });
    };

    const columns = [
        {
            header: "Post",
            accessor: (r: NewsPost) => (
                <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Image
                        src={getStorageUrl(r.thumbnail)}
                        alt={r.title}
                        className="w-14 h-10 rounded-lg object-cover bg-muted"
                     width={800} height={600}  loading="lazy" />
                    <div>
                        <p className="font-medium line-clamp-1">{r.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">
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
                <span className="text-sm text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                </span>
            ),
        },
        {
            header: "Actions",
            accessor: (r: NewsPost) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            openEdit(r);
                        }}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(r.id);
                        }}
                    >
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
                <Button onClick={openNew} className="font-display font-semibold">
                    <Plus className="w-4 h-4 mr-2" /> New Post
                </Button>
            }
        >
            <div className="mb-6 max-w-sm relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                        <DialogTitle className="font-display">
                            {editing?.id ? "Edit" : "New"} Post
                        </DialogTitle>
                    </DialogHeader>
                    {editing && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">Title *</label>
                                <Input
                                    value={editing.title || ""}
                                    onChange={(e) => {
                                        const title = e.target.value;
                                        const previousAutoSlug = toSlug(editing.title || "");
                                        const shouldAutoSlug =
                                            !editing.id &&
                                            (!editing.slug || editing.slug === previousAutoSlug);
                                        setEditing({
                                            ...editing,
                                            title,
                                            slug: shouldAutoSlug ? toSlug(title) : editing.slug,
                                        });
                                    }}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Slug *</label>
                                <Input
                                    value={editing.slug || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, slug: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Category</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editing.category || "news"}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            category: e.target.value as NewsPost["category"],
                                        })
                                    }
                                >
                                    {newsCategories.map((c) => (
                                        <option key={c} value={c} className="capitalize">
                                            {c.replace("-", " ")}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Related Product (optional)</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editing.related_product_id || ""}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            related_product_id: e.target.value || null,
                                        })
                                    }
                                >
                                    <option value="">None</option>
                                    {productOptions.map((product) => {
                                        const categoryName = getProductCategoryName(product);
                                        return (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                                {categoryName ? ` (${categoryName})` : ""}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">
                                    Thumbnail *
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
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setDraggingThumb(true);
                                    }}
                                    onDragEnter={(e) => {
                                        e.preventDefault();
                                        setDraggingThumb(true);
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        setDraggingThumb(false);
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setDraggingThumb(false);
                                        const file = e.dataTransfer.files?.[0];
                                        if (file) void uploadThumbnail(file);
                                    }}
                                    className={`rounded-lg border-2 border-dashed p-5 transition-colors ${
                                        draggingThumb
                                            ? "border-primary bg-primary/5"
                                            : "border-border bg-muted/30"
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-md bg-background border flex items-center justify-center">
                                                <Upload className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    Drag & drop image here
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    or choose from your computer
                                                </p>
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

                                    {editing.thumbnail ? (
                                        <div className="mt-4 rounded-md border bg-background p-3">
                                            <div className="flex items-center gap-3">
                                                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                                <p className="text-xs text-muted-foreground break-all">
                                                    {editing.thumbnail}
                                                </p>
                                            </div>
                                            <Image
                                                src={getStorageUrl(editing.thumbnail)}
                                                alt="News thumbnail preview"
                                                className="mt-3 w-full max-h-52 object-cover rounded-md border bg-muted"
                                             width={800} height={600}  loading="lazy" />
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">
                                    Content *
                                </label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[150px]"
                                    value={editing.content || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, content: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Status</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editing.status || "draft"}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            status: e.target.value as NewsPost["status"],
                                        })
                                    }
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Author</label>
                                <Input
                                    value={editing.author || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, author: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">Tags (comma separated)</label>
                                <Input
                                    value={tagsInput}
                                    onChange={(e) => setTagsInput(e.target.value)}
                                    placeholder="launch, truck, technology"
                                />
                            </div>
                            <div className="col-span-2 flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={saving}>
                                    {saving ? "Saving..." : "Save"}
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

