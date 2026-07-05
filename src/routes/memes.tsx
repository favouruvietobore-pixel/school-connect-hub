import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage, categoryQuery, SiteErrorComponent, SiteNotFound } from "@/components/category-page";

export const Route = createFileRoute("/memes")({
  head: () => ({
    meta: [
      { title: "Memes — MGB Report" },
      { name: "description", content: "The unserious side of MGB. Fresh campus memes to laugh out loud." },
      { property: "og:title", content: "Memes — MGB Report" },
      { property: "og:description", content: "The unserious side of MGB. Fresh campus memes to laugh out loud." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(categoryQuery(["memes"])),
  component: () => (
    <CategoryPage
      title="Memes 🤩"
      tagline="Unserious mode: activated. Laugh out loud and keep scrolling."
      categories={["memes"]}
      emptyLabel="memes"
    />
  ),
  errorComponent: SiteErrorComponent,
  notFoundComponent: SiteNotFound,
});