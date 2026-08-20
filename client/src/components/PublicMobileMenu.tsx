import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

type PublicMobileMenuProps = {
  links: Array<{ href: string; label: string }>;
  cta?: { href: string; label: string };
  account?: { label: string; onClick: () => void };
};

export default function PublicMobileMenu({ links, cta, account }: PublicMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const runAccount = () => { close(); account?.onClick(); };

  return (
    <div className="md:hidden">
      <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-controls="public-mobile-menu" aria-label={open ? "Close menu" : "Open menu"} className="inline-flex h-10 w-10 items-center justify-center border border-current/20">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <div id="public-mobile-menu" role="dialog" aria-label="Thinkoria mobile navigation" className="thinkoria-mobile-menu absolute inset-x-0 top-full z-50 isolate border-t border-current/15 bg-[#F3F0E8] text-[#171614] dark:bg-[#24221f] dark:text-[#F3F0E8] px-6 py-5 font-sans text-xs uppercase tracking-[0.14em] shadow-lg" style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}>
          <nav className="grid gap-1" aria-label="Mobile navigation">
            {links.map((link) => <a key={link.href} href={link.href} onClick={close} className="block border-b border-current/10 py-3">{link.label}</a>)}
            {account && <button type="button" onClick={runAccount} className="block w-full border-b border-current/10 py-3 text-left">{account.label}</button>}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-current/10 pt-4">
            <span>Appearance</span>
            <ThemeToggle />
          </div>
          {cta && <a href={cta.href} onClick={close} className="button-ink mt-4 w-full justify-center">{cta.label}</a>}
        </div>
      )}
    </div>
  );
}
