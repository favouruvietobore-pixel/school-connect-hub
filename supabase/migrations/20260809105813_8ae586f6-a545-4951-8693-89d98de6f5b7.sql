CREATE OR REPLACE FUNCTION public.toggle_post_like(_post_id uuid)
RETURNS TABLE(liked boolean, like_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _removed integer;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Sign in required';
  END IF;

  DELETE FROM public.post_likes
  WHERE post_id = _post_id AND user_id = _user_id;
  GET DIAGNOSTICS _removed = ROW_COUNT;

  IF _removed = 0 THEN
    INSERT INTO public.post_likes (post_id, user_id) VALUES (_post_id, _user_id);
    liked := true;
  ELSE
    liked := false;
  END IF;

  SELECT count(*) INTO like_count FROM public.post_likes WHERE post_id = _post_id;
  RETURN NEXT;
END;
$$;
REVOKE ALL ON FUNCTION public.toggle_post_like(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.toggle_post_like(uuid) TO authenticated, service_role;