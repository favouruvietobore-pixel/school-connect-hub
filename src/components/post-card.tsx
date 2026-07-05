import type { Database } from "@/integrations/supabase/types";

type Post = Database["public"]["Tables"]["posts"]["Row"];

const CATEGORY_LABEL: Record<Post["category"], string> = {
  latest: "Latest",
  school: "School",
  jamb: "JAMB",
  country: "Country",
  memes: "Meme",
  design: "Design",
};

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="mgb-shadow group flex flex-col overflow-hidden rounded-md border-2 border-foreground bg-card transition-transform hover:-translate-y-0.5">
      {post.image_url && (
        <div className="aspect-video overflow-hidden border-b-2 border-foreground bg-muted">
          <img
            src={post.image_url}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className="inline-block rounded-sm bg-primary px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-primary-foreground">
            {CATEGORY_LABEL[post.category]}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(post.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
        <h3 className="font-display text-2xl leading-tight text-foreground">{post.title}</h3>
        <p className="line-clamp-4 whitespace-pre-wrap text-sm text-muted-foreground">{post.content}</p>
      </div>
    </article>
  );
}

export function EmptyPosts({ label }: { label: string }) {
  return (
    <div className="mgb-shadow rounded-md border-2 border-dashed border-foreground bg-card p-10 text-center">
      <p className="font-display text-2xl">No {label} yet</p>
      <p className="mt-2 text-sm text-muted-foreground">MGB is cooking something. Check back soon 🔥</p>
    </div>
  );
}