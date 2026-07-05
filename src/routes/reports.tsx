import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage, categoryQuery, SiteErrorComponent, SiteNotFound } from "@/components/category-page";

const CATS = ["latest", "school", "jamb", "country"] as const;

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Latest Reports — MGB Report" },
      { name: "description", content: "Latest school updates, JAMB news, and country reports from MGB Report." },
      { property: "og:title", content: "Latest Reports — MGB Report" },
      { property: "og:description", content: "Latest school updates, JAMB news, and country reports from MGB Report." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(categoryQuery([...CATS])),
  component: () => (
    <CategoryPage
      title="Latest Reports"
      tagline="School, JAMB, and country updates — no beats missed."
      categories={[...CATS]}
      emptyLabel="reports"
    />
  ),
  errorComponent: SiteErrorComponent,
  notFoundComponent: SiteNotFound,
});