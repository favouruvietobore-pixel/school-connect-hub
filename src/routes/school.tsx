import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage, categoryQuery, SiteErrorComponent, SiteNotFound } from "@/components/category-page";

export const Route = createFileRoute("/school")({
  head: () => ({
    meta: [
      { title: "School Reports — MGB Report" },
      { name: "description", content: "Campus-specific updates, notices, and gist from your school." },
      { property: "og:title", content: "School Reports — MGB Report" },
      { property: "og:description", content: "Campus-specific updates, notices, and gist from your school." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(categoryQuery(["school"])),
  component: () => (
    <CategoryPage
      title="School Reports"
      tagline="Direct from campus — updates, notices, and everything worth knowing."
      categories={["school"]}
      emptyLabel="school reports"
    />
  ),
  errorComponent: SiteErrorComponent,
  notFoundComponent: SiteNotFound,
});