import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site-layout";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Newspaper, Palette, Smile } from "lucide-react";
import heroImg from "@/assets/hero.jpg";

const latestPostsQuery = {
  queryKey: ["posts", "latest-home"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);
    if (error) throw error;
    return data;
  },
};

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(latestPostsQuery),
  component: Index,
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

function Index() {
  return (
    <SiteLayout>
      <section className="border-b-2 border-foreground bg-background">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
          <div>
            <span className="inline-block rounded-sm bg-foreground px-2 py-1 text-xs font-bold uppercase tracking-widest text-background">
              Campus • JAMB • Country • Memes
            </span>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
              Serious updates.
              <br />
              <span className="text-primary">Unserious memes.</span> 😜📝
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-foreground md:text-lg">
              Welcome to MGB Report — where serious campus updates meet unserious memes.
              Stay informed, laugh out loud, and keep up with everything happening on campus
              without missing a beat.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/reports">
                <Button size="lg" className="mgb-shadow">
                  Read Reports <ArrowRight />
                </Button>
              </Link>
              <Link to="/memes">
                <Button size="lg" variant="secondary" className="mgb-shadow-red">
                  See Memes 🤩
                </Button>
              </Link>
            </div>
            <p className="mt-6 font-display text-lg text-primary">🔥 MGB GAT YOU COVERED 🔥</p>
          </div>
          <div className="mgb-shadow overflow-hidden rounded-md border-2 border-foreground">
            <img
              src={heroImg}
              alt="MGB Report — bold newspaper collage"
              width={1536}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-4xl">What's Inside</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {SECTIONS.map((s) => (
            <Link key={s.title} to={s.to} className="mgb-shadow group flex flex-col rounded-md border-2 border-foreground bg-card p-6 transition-transform hover:-translate-y-1">
              <span className={`inline-flex size-11 items-center justify-center rounded-md ${s.tint}`}>
                <s.icon />
              </span>
              <h3 className="mt-4 font-display text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                Explore <ArrowRight className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex items-end justify-between border-b-2 border-foreground pb-2">
          <h2 className="font-display text-4xl">Latest From MGB</h2>
          <Link to="/reports" className="text-sm font-semibold hover:underline">View all →</Link>
        </div>
        <Suspense fallback={<div className="mt-6 text-muted-foreground">Loading…</div>}>
          <LatestPosts />
        </Suspense>
      </section>
    </SiteLayout>
  );
}

const SECTIONS = [
  { icon: Newspaper, title: "Campus Reports", desc: "School updates, JAMB news, and what's happening in the country.", to: "/reports" as const, tint: "bg-primary text-primary-foreground" },
  { icon: Smile, title: "Memes Feed", desc: "The unserious side. Fresh memes to make campus life bearable.", to: "/memes" as const, tint: "bg-accent text-accent-foreground" },
  { icon: Palette, title: "Graphic Design", desc: "Eye-catching graphics for creators, students & businesses.", to: "/design" as const, tint: "bg-foreground text-background" },
];

function LatestPosts() {
  const { data } = useSuspenseQuery(latestPostsQuery);
  if (!data || data.length === 0) {
    return (
      <div className="mgb-shadow mt-6 rounded-md border-2 border-dashed border-foreground bg-card p-10 text-center">
        <p className="font-display text-2xl">Fresh reports dropping soon 🔥</p>
        <p className="mt-2 text-sm text-muted-foreground">MGB is cooking. Sign in and follow for updates.</p>
      </div>
    );
  }
  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}
