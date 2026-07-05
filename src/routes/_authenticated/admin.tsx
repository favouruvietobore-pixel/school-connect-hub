import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useAuth } from "@/lib/use-auth";
import { PostCard } from "@/components/post-card";
import type { Database } from "@/integrations/supabase/types";
import { Trash2 } from "lucide-react";

type Post = Database["public"]["Tables"]["posts"]["Row"];
type Category = Database["public"]["Enums"]["post_category"];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "latest", label: "Latest report" },
  { value: "school", label: "School update" },
  { value: "jamb", label: "JAMB news" },
  { value: "country", label: "Country news" },
  { value: "memes", label: "Meme" },
  { value: "design", label: "Design work" },
];

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — MGB Report" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("latest");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error("Admin access only.");
      navigate({ to: "/", replace: true });
    }
  }, [loading, isAdmin, navigate]);

  const loadPosts = async () => {
    const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    if (error) return toast.error(error.message);
    setPosts(data ?? []);
  };

  useEffect(() => { if (isAdmin) loadPosts(); }, [isAdmin]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("posts").insert({
        title: title.trim(),
        content: content.trim(),
        category,
        image_url: imageUrl.trim() || null,
        author_id: user.id,
      });
      if (error) throw error;
      toast.success("Post published! 🔥");
      setTitle(""); setContent(""); setImageUrl("");
      loadPosts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to publish");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    loadPosts();
  };

  if (loading) return <SiteLayout><div className="p-10 text-center">Loading…</div></SiteLayout>;
  if (!isAdmin) return null;

  return (
    <SiteLayout>
      <Toaster />
      <section className="border-b-2 border-foreground bg-background">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <span className="inline-block rounded-sm bg-primary px-2 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
            MGB Admin
          </span>
          <h1 className="mt-3 font-display text-5xl">Post Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Create new reports, memes, and design showcases.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_1.3fr]">
        <form onSubmit={submit} className="mgb-shadow h-fit space-y-4 rounded-md border-2 border-foreground bg-card p-6">
          <h2 className="font-display text-2xl">New Post</h2>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. JAMB releases 2026 timetable" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="image">Image URL (optional)</Label>
            <Input id="image" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" required rows={8} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write the story…" />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Publishing…" : "Publish Post"}
          </Button>
        </form>

        <div>
          <h2 className="font-display text-3xl">All Posts ({posts.length})</h2>
          <div className="mt-4 space-y-4">
            {posts.length === 0 && (
              <p className="rounded-md border-2 border-dashed border-foreground p-6 text-center text-muted-foreground">
                No posts yet. Publish your first one 🔥
              </p>
            )}
            {posts.map((p) => (
              <div key={p.id} className="relative">
                <PostCard post={p} />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute right-3 top-3 z-10"
                  onClick={() => remove(p.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}