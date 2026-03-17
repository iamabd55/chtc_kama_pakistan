"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminDb } from "@/lib/supabase/adminClient";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
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

const serializeTags = (tags?: string[]) => (tags ?? []).join(", ");

const parseTags = (value: string): string[] =>
    value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

const toSlug = (value: string): string =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

const AdminNews = () => {
    const [posts, setPosts] = useState<NewsPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<NewsPost> | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await adminDb
            .from("news_posts")
            .select("*")
            .order("created_at", { ascending: false });
        setPosts((data as NewsPost[]) || []);
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
            author: "CHTC Kama Pakistan",
        });
        setDialogOpen(true);
    };
    const openEdit = (p: NewsPost) => {
        setEditing({ ...p });
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
            excerpt: editing.excerpt || null,
            category: editing.category || "news",
            thumbnail: editing.thumbnail,
            author: editing.author || "CHTC Kama Pakistan",
            tags: editing.tags || [],
            status: editing.status || "draft",
            meta_title: editing.meta_title || null,
            meta_desc: editing.meta_desc || null,
            published_at:
                editing.status === "published"
                    ? editing.published_at || new Date().toISOString()
                    : null,
        };

        if (editing.id) {
            const { error } = await adminDb
                .from("news_posts")
                .update(payload)
                .eq("id", editing.id);
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else toast({ title: "Post updated" });
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
        const { error } = await adminDb.from("news_posts").delete().eq("id", id);
        if (error)
            toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            toast({ title: "Post deleted" });
            fetchData();
        }
    };

    const columns = [
        {
            header: "Post",
            accessor: (r: NewsPost) => (
                <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={getStorageUrl(r.thumbnail)}
                        alt={r.title}
                        className="w-14 h-10 rounded-lg object-cover bg-muted"
                    />
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
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">
                                    Thumbnail URL *
                                </label>
                                <Input
                                    value={editing.thumbnail || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, thumbnail: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">Excerpt</label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
                                    value={editing.excerpt || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, excerpt: e.target.value })
                                    }
                                />
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
                                    value={serializeTags(editing.tags)}
                                    onChange={(e) =>
                                        setEditing({ ...editing, tags: parseTags(e.target.value) })
                                    }
                                    placeholder="launch, truck, technology"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">Meta Title</label>
                                <Input
                                    value={editing.meta_title || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, meta_title: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">Meta Description</label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[70px]"
                                    value={editing.meta_desc || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, meta_desc: e.target.value })
                                    }
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
