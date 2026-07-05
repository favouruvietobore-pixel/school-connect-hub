import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MGB — MGB Report" },
      { name: "description", content: "About MGB Report: vision, mission, and the story behind the campus newsroom + meme hub." },
      { property: "og:title", content: "About MGB — MGB Report" },
      { property: "og:description", content: "Vision, mission, and the story behind MGB Report." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <span className="inline-block rounded-sm bg-primary px-2 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
            About
          </span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">About MGB Report</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            MGB Report is where serious campus updates meet unserious memes. From school
            notices, JAMB updates, and country news to the freshest campus memes — we keep
            you informed and entertained.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            Alongside reporting, MGB delivers eye-catching graphic design work for creators,
            entrepreneurs, and businesses that want to stand out online.
          </p>
          <p className="mt-6 font-display text-2xl text-primary">🔥 MGB GAT YOU COVERED 🔥</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-6 px-4 py-12 md:grid-cols-2">
        <div className="mgb-shadow rounded-md border-2 border-foreground bg-card p-6">
          <h2 className="font-display text-3xl text-primary">Vision</h2>
          <p className="mt-3 text-muted-foreground">
            To shape the future of digital expression by making creativity and content
            accessible to everyone.
          </p>
        </div>
        <div className="mgb-shadow rounded-md border-2 border-foreground bg-accent p-6 text-accent-foreground">
          <h2 className="font-display text-3xl">Mission</h2>
          <p className="mt-3">
            To provide eye-catching graphics and authentic blog content that help creators,
            entrepreneurs, and businesses stand out online.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}