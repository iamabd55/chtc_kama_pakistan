/** Ask the server to refresh cached /find-dealer pages (call after admin dealer CRUD). */
export async function revalidateDealerPages(): Promise<void> {
    try {
        const res = await fetch("/api/admin/revalidate/dealers", {
            method: "POST",
            credentials: "include",
        });
        if (!res.ok) {
            console.warn("Dealer page revalidation failed:", res.status);
        }
    } catch (err) {
        console.warn("Dealer page revalidation failed:", err);
    }
}
