import { useEffect, useState } from "react";
import { Heart, MessageCircle, Send, Share2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/use-auth";

type Comment = {
  id: string;
  display_name: string;
  content: string;
  created_at: string;
};

export function PostEngagement({ postId, title }: { postId: string; title: string }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadEngagement = async () => {
    const { data } = await supabase.rpc("get_post_engagement", { _post_id: postId });
    const totals = data?.[0];
    setLikes(Number(totals?.like_count ?? 0));
    setCommentCount(Number(totals?.comment_count ?? 0));
  };

  const loadComments = async () => {
    const { data } = await supabase.rpc("get_post_comments", { _post_id: postId });
    setComments(data ?? []);
  };

  useEffect(() => {
    void loadEngagement();
  }, [postId]);

  const toggleLike = async () => {
    if (!user) return;

    if (liked) {
      const { error } = await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
      if (!error) {
        setLiked(false);
        setLikes((value) => Math.max(0, value - 1));
      }
      return;
    }

    const { error } = await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
    if (!error) {
      setLiked(true);
      setLikes((value) => value + 1);
      return;
    }

    if (error.code === "23505") {
      const { error: removeError } = await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
      if (!removeError) {
        setLiked(false);
        setLikes((value) => Math.max(0, value - 1));
      }
    }
  };

  const openComments = () => {
    const next = !commentsOpen;
    setCommentsOpen(next);
    if (next) void loadComments();
  };

  const submitComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !comment.trim()) return;
    setSubmitting(true);
    const fallbackName = user.email?.split("@")[0] ?? "MGB Reader";
    const { error } = await supabase.from("post_comments").insert({
      post_id: postId,
      user_id: user.id,
      display_name: name.trim() || fallbackName,
      content: comment.trim(),
    });
    if (!error) {
      setComment("");
      await Promise.all([loadComments(), loadEngagement()]);
    }
    setSubmitting(false);
  };

  const sharePost = async () => {
    const url = `${window.location.origin}${window.location.pathname}#post-${postId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `Read “${title}” on MGB Report`, url });
        return;
      } catch {
        return;
      }
    }
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="border-t-2 border-foreground">
      <div className="flex min-h-12 items-center gap-1 px-3 py-2">
        {user ? (
          <Button size="sm" variant="ghost" onClick={toggleLike} aria-label={liked ? "Remove like" : "Like post"}>
            <Heart className={liked ? "fill-primary text-primary" : ""} /> {likes}
          </Button>
        ) : (
          <Button size="sm" variant="ghost" asChild>
            <Link to="/auth" aria-label="Sign in to like"><Heart /> {likes}</Link>
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={openComments} aria-expanded={commentsOpen}>
          <MessageCircle /> {commentCount}
        </Button>
        <Button size="icon" variant="ghost" className="ml-auto" onClick={sharePost} aria-label="Share this post" title="Share this post">
          <Share2 />
        </Button>
      </div>

      {commentsOpen && (
        <div className="space-y-3 border-t-2 border-foreground bg-muted p-4">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Be the first to comment.</p>
          ) : (
            <div className="max-h-64 space-y-3 overflow-y-auto">
              {comments.map((item) => (
                <div key={item.id} className="border-l-2 border-primary pl-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <strong className="text-sm">{item.display_name}</strong>
                    <span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{item.content}</p>
                </div>
              ))}
            </div>
          )}

          {user ? (
            <form onSubmit={submitComment} className="space-y-2 border-t border-foreground/20 pt-3">
              <Input value={name} maxLength={40} onChange={(event) => setName(event.target.value)} placeholder="Display name (optional)" aria-label="Display name" />
              <Textarea value={comment} maxLength={1000} required onChange={(event) => setComment(event.target.value)} placeholder="Write a comment…" rows={3} aria-label="Comment" />
              <Button size="sm" type="submit" disabled={submitting || !comment.trim()}>
                <Send /> {submitting ? "Posting…" : "Post comment"}
              </Button>
            </form>
          ) : (
            <Button size="sm" variant="outline" asChild>
              <Link to="/auth">Sign in to comment</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}