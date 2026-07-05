import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage, categoryQuery, SiteErrorComponent, SiteNotFound } from "@/components/category-page";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/components/site-footer";
import { MessageCircle, Mail } from "lucide-react";

const DesignCTA = (
  <section className="border-b-2 border-foreground bg-accent text-accent-foreground">
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-[1.4fr_1fr] md:items-center">
      <div>
        <h2 className="font-display text-3xl md:text-4xl">Need a bold graphic? MGB gat you.</h2>
        <p className="mt-2 max-w-xl text-sm md:text-base">
          Flyers, event posters, social media graphics, logos — eye-catching design that makes you stand out online.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 md:justify-end">
        <a href={CONTACT.whatsappHref} target="_blank" rel="noreferrer">
          <Button size="lg" className="mgb-shadow"><MessageCircle /> WhatsApp MGB</Button>
        </a>
        <a href={`mailto:${CONTACT.email}`}>
          <Button size="lg" variant="secondary" className="mgb-shadow"><Mail /> Email</Button>
        </a>
      </div>
    </div>
  </section>
);

export const Route = createFileRoute("/design")({
  head: () => ({
    meta: [
      { title: "Graphic Design — MGB Report" },
      { name: "description", content: "Eye-catching graphic design by MGB — flyers, posters, logos, and social media content." },
      { property: "og:title", content: "Graphic Design — MGB Report" },
      { property: "og:description", content: "Eye-catching graphic design by MGB — flyers, posters, logos, and social media content." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(categoryQuery(["design"])),
  component: () => (
    <CategoryPage
      title="Graphic Design"
      tagline="A portfolio of bold, campus-ready designs by MGB."
      categories={["design"]}
      emptyLabel="design work"
      extra={DesignCTA}
    />
  ),
  errorComponent: SiteErrorComponent,
  notFoundComponent: SiteNotFound,
});