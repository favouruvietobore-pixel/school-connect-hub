import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site-layout";
import { PostCard, EmptyPosts } from "@/components/post-card";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Enums"]["post_category"];

export function categoryQuery(categories: Category[]) {
  return {
    queryKey: ["posts", "cat", ...categories],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .in("category", categories)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  };
}

export function CategoryPage({
  title,
  tagline,
  categories,
  emptyLabel,
  extra,
}: {
  title: string;
  tagline: string;
  categories: Category[];
  emptyLabel: string;
  extra?: ReactNode;
}) {
  return (
    <SiteLayout>
      <section className="border-b-2 border-foreground bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <span className="inline-block rounded-sm bg-primary px-2 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
            MGB Report
          </span>
          <h1 className="mt-3 font-display text-5xl leading-none md:text-6xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{tagline}</p>
        </div>
      </section>
      {extra}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
          <CategoryList categories={categories} emptyLabel={emptyLabel} />
        </Suspense>
      </section>
    </SiteLayout>
  );
}

function CategoryList({ categories, emptyLabel }: { categories: Category[]; emptyLabel: string }) {
  const { data } = useSuspenseQuery(categoryQuery(categories));
  if (!data || data.length === 0) return <EmptyPosts label={emptyLabel} />;
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}

export function makeCategoryRoute(path: `/${string}`, opts: {
  title: string;
  description: string;
  tagline: string;
  categories: Category[];
  emptyLabel: string;
  extra?: ReactNode;
}) {
  return createFileRoute(path as never)({
    head: () => ({
      meta: [
        { title: `${opts.title} — MGB Report` },
        { name: "description", content: opts.description },
        { property: "og:title", content: `${opts.title} — MGB Report` },
        { property: "og:description", content: opts.description },
      ],
    }),
    loader: ({ context }) => context.queryClient.ensureQueryData(categoryQuery(opts.categories)),
    component: () => (
      <CategoryPage
        title={opts.title}
        tagline={opts.tagline}
        categories={opts.categories}
        emptyLabel={opts.emptyLabel}
        extra={opts.extra}
      />
    ),
    errorComponent: ({ error }) => (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="font-display text-4xl">Something broke</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        </div>
      </SiteLayout>
    ),
    notFoundComponent: () => (
      <SiteLayout><div className="p-10 text-center">Not found</div></SiteLayout>
    ),
  });
}