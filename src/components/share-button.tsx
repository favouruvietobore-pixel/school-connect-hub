import { Check, Link2, Mail, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const SITE_URL = "https://mgbreport.lovable.app";

const SUBJECT = "Check out MGB Report";
const BODY = `Yo! Check out MGB Report — where serious campus updates meet unserious memes.\n\n${SITE_URL}\n\n🔥 MGB GAT YOU COVERED 🔥`;

export function ShareButton({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const mailto = `mailto:?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: SUBJECT, text: BODY, url: SITE_URL });
        return;
      } catch {
        /* user cancelled */
      }
    }
    window.location.href = mailto;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button size="sm" onClick={nativeShare} className="gap-2">
        <Share2 className="size-4" /> Share
      </Button>
      <Button size="sm" variant="secondary" asChild className="gap-2">
        <a href={mailto}>
          <Mail className="size-4" /> Email link
        </a>
      </Button>
      <Button size="sm" variant="outline" onClick={copy} className="gap-2">
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
        {copied ? "Copied!" : "Copy link"}
      </Button>
    </div>
  );
}