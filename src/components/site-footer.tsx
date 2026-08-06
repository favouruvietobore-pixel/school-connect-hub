import { Instagram, Mail, MessageCircle } from "lucide-react";
import { ShareButton } from "@/components/share-button";

export const CONTACT = {
  email: "akinbinumarvellous@gmail.com",
  whatsapp: "+2349054360650",
  whatsappHref: "https://wa.me/2349054360650",
  instagram: "@mgb51068",
  instagramHref: "https://instagram.com/mgb51068",
};

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t-2 border-foreground bg-foreground text-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-sm bg-primary px-2 py-1 font-display text-xl leading-none text-primary-foreground">
              MGB
            </span>
            <span className="font-display text-xl">REPORT</span>
          </div>
          <p className="mt-3 text-sm text-background/70">
            Where serious campus updates meet unserious memes. Stay informed, laugh out loud.
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg text-accent">Follow & Contact</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={CONTACT.whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
                <MessageCircle className="size-4" /> WhatsApp: {CONTACT.whatsapp}
              </a>
            </li>
            <li>
              <a href={CONTACT.instagramHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
                <Instagram className="size-4" /> Instagram: {CONTACT.instagram}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 hover:text-accent">
                <Mail className="size-4" /> {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-accent">MGB Motto</h3>
          <p className="mt-3 font-display text-xl leading-tight">
            🔥 MGB GAT YOU COVERED 🔥
          </p>
          <p className="mt-4 text-sm text-background/70">Share MGB Report with a friend</p>
          <ShareButton className="mt-2" />
        </div>
      </div>
      <div className="border-t border-background/20 py-4 text-center text-xs text-background/60">
        © {new Date().getFullYear()} MGB Report. All rights reserved.
      </div>
    </footer>
  );
}