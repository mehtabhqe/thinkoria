/*
 * The Reading Room: warm paper, ink-black type, vermilion marks, and an asymmetric journal-like composition.
 * This page should feel like a contemporary independent journal: quiet, exacting, and generous.
 */
import { ArrowUpRight, ChevronRight, CircleArrowUp, Menu, X } from "lucide-react";
import { useState } from "react";

const categories = [
  ["01", "Philosophy", "ethics · metaphysics · politics"],
  ["02", "Literature", "poetry · criticism · fiction"],
  ["03", "Media", "images · platforms · publics"],
  ["04", "Gaming", "play · worlds · systems"],
  ["05", "Science", "nature · mind · matter"],
  ["06", "Technology", "code · tools · futures"],
  ["07", "Religion", "belief · ritual · meaning"],
  ["08", "Linguistics", "language · signs · speech"],
  ["09", "Society", "culture · power · place"],
  ["10", "History", "archives · memory · time"],
  ["11", "Economics", "labour · value · exchange"],
  ["12", "Art & Design", "form · making · attention"],
];

const papers = [
  { label: "A new paper", title: "The politics of being unfinished", author: "Mara Voss", category: "Philosophy", number: "CI–014" },
  { label: "Field note", title: "Against frictionless reading", author: "Jon Bell", category: "Media", number: "CI–013" },
  { label: "Working paper", title: "The interface as a room", author: "Leila Okafor", category: "Technology", number: "CI–012" },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#F3F0E8] text-[#171614]">
      <div className="paper-noise" aria-hidden="true" />
      <header className="relative z-10 border-b border-[#171614]/15">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 lg:px-12">
          <a className="flex items-center gap-3" href="#top" aria-label="The Common Index home">
            <img src="/manus-storage/common-index-mark_234d3c95.png" alt="" className="h-9 w-9 object-contain" />
            <span className="font-serif text-[21px] leading-none tracking-[-0.035em]">The Common Index</span>
          </a>
          <nav className="hidden items-center gap-10 font-sans text-[11px] font-medium tracking-[0.14em] uppercase md:flex" aria-label="Primary navigation">
            <a className="nav-link" href="#index">Explore the index</a>
            <a className="nav-link" href="#about">About</a>
            <a className="button-ink" href="mailto:submit@thecommonindex.org?subject=Paper submission">Submit a paper <ArrowUpRight size={14} /></a>
          </nav>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {mobileOpen && <div className="border-t border-[#171614]/15 px-6 py-5 font-sans text-xs uppercase tracking-[0.14em] md:hidden">
          <a onClick={() => setMobileOpen(false)} className="block py-3" href="#index">Explore the index</a>
          <a onClick={() => setMobileOpen(false)} className="block py-3" href="#about">About</a>
          <a onClick={() => setMobileOpen(false)} className="mt-3 inline-flex items-center gap-2 border border-[#171614] px-4 py-3" href="mailto:submit@thecommonindex.org?subject=Paper submission">Submit a paper <ArrowUpRight size={14} /></a>
        </div>}
      </header>

      <section id="top" className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.03fr_0.97fr] lg:gap-16 lg:px-12 lg:pb-28 lg:pt-24">
        <div className="relative z-10 flex flex-col justify-between">
          <div>
            <div className="eyebrow mb-8"><span className="vermilion-dot" /> An open index of serious ideas</div>
            <h1 className="max-w-[760px] font-serif text-[clamp(3.8rem,8vw,8.4rem)] leading-[0.88] tracking-[-0.06em]">Ideas worth keeping <em>in circulation.</em></h1>
            <p className="mt-9 max-w-[500px] font-sans text-[15px] leading-7 text-[#171614]/70">The Common Index is a publishing room for papers, essays, and working thoughts that move between disciplines. Read closely. Think outward.</p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a href="#index" className="button-vermilion">Browse the index <ChevronRight size={16} /></a>
              <a href="mailto:submit@thecommonindex.org?subject=Paper submission" className="inline-flex items-center gap-2 font-sans text-[11px] font-semibold tracking-[0.12em] uppercase underline decoration-[#C8472C] decoration-2 underline-offset-8 transition-transform duration-200 hover:translate-x-1">Send your work <ArrowUpRight size={14} /></a>
            </div>
          </div>
          <div className="mt-16 flex items-end justify-between border-t border-[#171614]/20 pt-5 lg:mt-24">
            <p className="max-w-[280px] font-sans text-[11px] leading-5 text-[#171614]/60">For the curious, the exacting, and the generously unfinished.</p>
            <span className="font-sans text-[11px] tracking-[0.14em] text-[#171614]/50">VOL. 01 / 2026</span>
          </div>
        </div>
        <div className="relative min-h-[440px] lg:min-h-[640px]">
          <div className="absolute -right-16 -top-10 hidden font-serif text-[180px] leading-none text-[#C8472C]/10 lg:block">01</div>
          <div className="relative h-full overflow-hidden border border-[#171614]/20 bg-[#DED8CA]">
            <img src="/manus-storage/common-index-hero_03007214.png" alt="Papers and a fountain pen on an archival desk" className="h-full min-h-[440px] w-full object-cover grayscale-[12%] transition-transform duration-700 hover:scale-[1.025] lg:min-h-[640px]" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[#171614]/75 to-transparent px-6 pb-6 pt-28 text-[#F3F0E8]">
              <div><p className="eyebrow !text-[#F3F0E8]/75">On the desk</p><p className="mt-2 font-serif text-2xl">A place for the unfinished thought.</p></div>
              <span className="font-sans text-[10px] tracking-[0.15em] uppercase">Image / 001</span>
            </div>
          </div>
          <span className="register-mark register-mark-top" aria-hidden="true" /><span className="register-mark register-mark-bottom" aria-hidden="true" />
        </div>
      </section>

      <section id="index" className="border-t border-[#171614]/15 bg-[#EAE5DA] px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-14 grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div><div className="eyebrow"><span className="vermilion-dot" /> Browse by field</div><div className="citation-mark mt-7" aria-hidden="true"><span /> <b>CI / 01</b></div><h2 className="mt-5 max-w-[410px] font-serif text-5xl leading-[0.94] tracking-[-0.045em] lg:text-7xl">A catalogue of <em>questions.</em></h2></div>
            <p className="max-w-[510px] self-end font-sans text-[15px] leading-7 text-[#171614]/65">No subject exists in isolation. Find a starting point below, then follow the references wherever they lead. New categories are added as the index grows.</p>
          </div>
          <div className="grid border-l border-t border-[#171614]/20 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map(([number, name, detail], index) => <a href={`mailto:submit@thecommonindex.org?subject=${name} paper submission`} key={name} className={`group relative flex min-h-[145px] flex-col justify-between border-b border-r border-[#171614]/20 p-5 transition-colors duration-200 hover:bg-[#F3F0E8] lg:min-h-[165px] ${index === 1 ? "lg:translate-y-3" : index === 6 ? "lg:-translate-y-3" : ""}`}>
              <div className="flex items-center justify-between font-sans text-[10px] tracking-[0.15em] text-[#171614]/50"><span>{number}</span><ArrowUpRight size={15} className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" /></div>
              <div><h3 className="font-serif text-[27px] leading-none">{name}</h3><p className="mt-3 font-sans text-[10px] tracking-[0.09em] text-[#171614]/55 uppercase">{detail}</p></div>
            </a>)}
          </div>
        </div>
      </section>

      <section id="about" className="relative mx-auto grid max-w-[1440px] gap-12 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-12 lg:py-28">
        <div><div className="eyebrow"><span className="vermilion-dot" /> The latest from the room</div><div className="citation-mark mt-7" aria-hidden="true"><span /> <b>CI / 02</b></div><p className="mt-6 max-w-[290px] font-sans text-xs leading-6 text-[#171614]/60">A small, steady stream of new work. Read something slowly.</p></div>
        <div className="border-t border-[#171614]/20">{papers.map((paper, index) => <article key={paper.number} className="group grid gap-5 border-b border-[#171614]/20 py-7 transition-colors duration-200 hover:bg-[#F3F0E8] lg:grid-cols-[0.26fr_1fr_0.22fr] lg:px-4">
          <div className="font-sans text-[10px] tracking-[0.14em] text-[#171614]/50 uppercase"><span>{paper.label}</span><br /><span>{paper.number}</span></div>
          <div><h3 className="max-w-[570px] font-serif text-3xl leading-[0.98] tracking-[-0.025em]">{paper.title}</h3><p className="mt-3 font-sans text-xs text-[#171614]/55">{paper.author} <span className="mx-2 text-[#C8472C]">/</span> {paper.category}</p></div>
          <div className="flex items-end justify-start lg:justify-end"><ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" size={19} /></div>
        </article>)}</div>
      </section>

      <section className="relative overflow-hidden bg-[#171614] px-6 py-20 text-[#F3F0E8] lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-end">
          <div><div className="eyebrow !text-[#F3F0E8]/60"><span className="vermilion-dot" /> For contributors</div><h2 className="mt-6 max-w-[570px] font-serif text-5xl leading-[0.92] tracking-[-0.05em] lg:text-7xl">Send the work.<br /><em>We’ll read it closely.</em></h2></div>
          <div className="lg:pl-10"><p className="max-w-[500px] font-sans text-[15px] leading-7 text-[#F3F0E8]/65">Have a paper, essay, review, or working thought that wants a wider conversation? Email us a PDF or a link, along with a short note about the work.</p><a className="button-vermilion mt-8" href="mailto:submit@thecommonindex.org?subject=Paper submission">submit@thecommonindex.org <ArrowUpRight size={16} /></a></div>
        </div>
        <div className="absolute -bottom-20 -right-5 font-serif text-[220px] leading-none text-[#F3F0E8]/[0.035]">CI</div>
      </section>

      <footer className="border-t border-[#171614]/15 bg-[#F3F0E8] px-6 py-7 lg:px-12"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-5 font-sans text-[10px] tracking-[0.13em] text-[#171614]/55 uppercase sm:flex-row"><span>© The Common Index / An independent publishing room</span><span>Made for ideas in motion <CircleArrowUp size={14} className="ml-2 inline text-[#C8472C]" /></span></div></footer>
    </main>
  );
}
