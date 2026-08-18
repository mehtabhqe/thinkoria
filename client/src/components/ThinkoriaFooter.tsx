import { ArrowUpRight, Instagram, Linkedin, Mail, MapPin } from "lucide-react";

const footerLinks = [
  ["About", "/about"],
  ["Catalogue", "/catalogue"],
  ["Nagaon Club", "/club"],
  ["Forum", "/forum"],
  ["Submit a paper", "/submit"],
] as const;

export default function ThinkoriaFooter() {
  return (
    <footer className="border-t border-[#171614]/20 bg-[#171614] text-[#F3F0E8]">
      <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_.7fr_.8fr] lg:gap-20">
          <div>
            <div className="flex min-h-16 items-center" data-footer-brand="thinkoria"><img src="/manus-storage/thinkoria-logo_8998c7d8.png" alt="Thinkoria" className="h-16 w-40 object-contain object-left brightness-0 invert" /></div>
            <p className="mt-6 max-w-[360px] font-serif text-3xl leading-[.98] text-[#F3F0E8]">A place of ideas.</p>
            <p className="mt-5 max-w-[390px] font-sans text-sm leading-7 text-[#F3F0E8]/60">An independent publishing room for papers, essays, conversation, and work still becoming.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="https://www.instagram.com/thinkoria/" target="_blank" rel="noreferrer" aria-label="Thinkoria on Instagram" className="inline-flex items-center gap-2 border border-[#F3F0E8]/25 px-3 py-2 font-sans text-[10px] font-semibold uppercase tracking-[.12em] transition-colors hover:border-[#C8472C] hover:text-[#C8472C]"><Instagram size={14} /> Instagram</a>
              <a href="https://www.linkedin.com/company/thinkoria/" target="_blank" rel="noreferrer" aria-label="Thinkoria on LinkedIn" className="inline-flex items-center gap-2 border border-[#F3F0E8]/25 px-3 py-2 font-sans text-[10px] font-semibold uppercase tracking-[.12em] transition-colors hover:border-[#C8472C] hover:text-[#C8472C]"><Linkedin size={14} /> LinkedIn</a>
            </div>
          </div>
          <div>
            <p className="eyebrow !text-[#F3F0E8]/55"><span className="vermilion-dot" /> Navigate</p>
            <nav className="mt-6 flex flex-col items-start gap-3" aria-label="Footer navigation">{footerLinks.map(([label, href]) => <a key={href} href={href} className="group inline-flex items-center gap-2 font-sans text-sm text-[#F3F0E8]/75 transition-colors hover:text-[#C8472C]">{label}<ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" /></a>)}</nav>
          </div>
          <div>
            <p className="eyebrow !text-[#F3F0E8]/55"><span className="vermilion-dot" /> Find the room</p>
            <div className="mt-6 space-y-5 font-sans text-sm leading-6 text-[#F3F0E8]/70">
              <a href="mailto:hello@thinkoria.org" className="flex items-start gap-3 transition-colors hover:text-[#C8472C]"><Mail size={16} className="mt-1 shrink-0 text-[#C8472C]" /><span>hello@thinkoria.org</span></a>
              <a href="mailto:submissions@thinkoria.org" className="flex items-start gap-3 transition-colors hover:text-[#C8472C]"><Mail size={16} className="mt-1 shrink-0 text-[#C8472C]" /><span>submissions@thinkoria.org</span></a>
              <p className="flex items-start gap-3"><MapPin size={16} className="mt-1 shrink-0 text-[#C8472C]" /><span>Nagaon, Assam<br />India</span></p>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-[#F3F0E8]/15 pt-5 font-sans text-[10px] uppercase tracking-[.12em] text-[#F3F0E8]/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© Thinkoria / A place of ideas</p>
          <p>Made by <span className="text-[#F3F0E8]/75">Earden Media</span> and <span className="text-[#F3F0E8]/75">Mehtab Hoque</span></p>
        </div>
      </div>
    </footer>
  );
}
