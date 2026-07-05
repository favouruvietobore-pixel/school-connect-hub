import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { CONTACT } from "@/components/site-footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Follow — MGB Report" },
      { name: "description", content: "Reach MGB Report on WhatsApp, Instagram, or email. Follow for updates and drop your requests." },
      { property: "og:title", content: "Contact & Follow — MGB Report" },
      { property: "og:description", content: "Reach MGB Report on WhatsApp, Instagram, or email." },
    ],
  }),
  component: Contact,
});

const LINKS = [
  { icon: MessageCircle, label: "WhatsApp", value: CONTACT.whatsapp, href: CONTACT.whatsappHref, tint: "bg-primary text-primary-foreground" },
  { icon: Instagram, label: "Instagram", value: CONTACT.instagram, href: CONTACT.instagramHref, tint: "bg-accent text-accent-foreground" },
  { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, tint: "bg-foreground text-background" },
];

function Contact() {
  return (
    <SiteLayout>
      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <span className="inline-block rounded-sm bg-foreground px-2 py-1 text-xs font-bold uppercase tracking-widest text-background">
            Get In Touch
          </span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Contact & Follow</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Got a story, a meme, or need a bold graphic? Slide into any of these — MGB
            replies fast.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-4 px-4 py-10 md:grid-cols-3">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="mgb-shadow group flex flex-col rounded-md border-2 border-foreground bg-card p-6 transition-transform hover:-translate-y-1"
          >
            <span className={`inline-flex size-11 items-center justify-center rounded-md ${l.tint}`}>
              <l.icon />
            </span>
            <h2 className="mt-4 font-display text-2xl">{l.label}</h2>
            <p className="mt-1 break-all text-sm text-muted-foreground">{l.value}</p>
          </a>
        ))}
      </section>
    </SiteLayout>
  );
}