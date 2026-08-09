REVOKE SELECT ON public.post_likes FROM authenticated;
GRANT SELECT (id, post_id, created_at) ON public.post_likes TO anon, authenticated;
CREATE POLICY "Anyone can read safe like rows" ON public.post_likes FOR SELECT TO anon, authenticated USING (true);

REVOKE SELECT ON public.post_comments FROM authenticated;
GRANT SELECT (id, post_id, display_name, content, created_at, updated_at) ON public.post_comments TO anon, authenticated;
CREATE POLICY "Anyone can read published comments" ON public.post_comments FOR SELECT TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.get_post_engagement(_post_id uuid)
RETURNS TABLE(like_count bigint, comment_count bigint)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    (SELECT count(post_id) FROM public.post_likes WHERE post_id = _post_id),
    (SELECT count(post_id) FROM public.post_comments WHERE post_id = _post_id)
$$;

CREATE OR REPLACE FUNCTION public.get_post_comments(_post_id uuid)
RETURNS TABLE(id uuid, display_name text, content text, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT c.id, c.display_name, c.content, c.created_at
  FROM public.post_comments c
  WHERE c.post_id = _post_id
  ORDER BY c.created_at ASC
$$;