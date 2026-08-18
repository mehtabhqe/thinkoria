import ThinkoriaFooter from "@/components/ThinkoriaFooter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { isVercelPreview, manusHref } from "@/lib/manusHandoff";
import { ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const roles = [
  ["debator", "Debator"],
  ["mediator", "Mediator"],
  ["jury", "Jury / adjudicator"],
  ["timekeeper", "Timekeeper"],
  ["organizer", "Debate organizer"],
  ["observer", "Observer / researcher"],
  ["other", "Other debate body"],
] as const;

type Role = (typeof roles)[number][0];

export default function Club() {
  const [memberOpen, setMemberOpen] = useState(false);
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [role, setRole] = useState<Role>("debator");
  const [otherRole, setOtherRole] = useState("");
  const [note, setNote] = useState("");
  const { user } = useAuth();
  const eventsQuery = trpc.club.events.useQuery();
  const joinMutation = trpc.club.join.useMutation({ onSuccess: () => { toast.success("You are on the Nagaon Club list."); setMemberOpen(false); }, onError: (error) => toast.error(error.message) });
  const applicationMutation = trpc.club.submitApplication.useMutation({ onSuccess: () => { toast.success("Your debate role application has been received."); setApplicationOpen(false); setRole("debator"); setOtherRole(""); setNote(""); }, onError: (error) => toast.error(error.message) });
  const event = eventsQuery.data?.[0];
  const joinClub = () => {
    if (isVercelPreview()) {
      window.location.href = manusHref("/club");
      return;
    }
    if (!user) { startLogin(); return; }
    joinMutation.mutate();
  };
  const openApplication = () => {
    if (isVercelPreview()) {
      window.location.href = manusHref("/club");
      return;
    }
    if (!user) { startLogin(); return; }
    setApplicationOpen(true);
  };
  const submitApplication = (submission: React.FormEvent) => { submission.preventDefault(); applicationMutation.mutate({ eventId: event?.id, role, otherRole: role === "other" ? otherRole : undefined, note: note || undefined }); };
  const dateLabel = event ? new Date(event.eventDate).toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "short" }) : "To be announced";
  const timeLabel = event ? new Date(event.eventDate).toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" }) : "A new date will be shared soon";

  return <main className="min-h-screen bg-[#171614] text-[#F3F0E8]"><header className="border-b border-[#F3F0E8]/15"><div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 lg:px-12"><a href="/" className="flex items-center gap-3"><img src="/manus-storage/thinkoria-logo_8998c7d8.png" alt="" className="h-9 w-9 object-contain grayscale brightness-200"/><span className="font-serif text-[21px] leading-none tracking-[-0.035em]">Thinkoria</span></a><div className="flex items-center gap-6 font-sans text-[10px] uppercase tracking-[0.14em]"><a href="/catalogue" className="hidden sm:block nav-link !text-[#F3F0E8]/70">Catalogue</a><a href="/forum" className="hidden sm:block nav-link !text-[#F3F0E8]/70">Forum</a><button onClick={() => setMemberOpen(true)} className="button-vermilion">Join the club <ArrowUpRight size={14}/></button></div></div></header>
    <section className="relative overflow-hidden border-b border-[#F3F0E8]/15"><div className="mx-auto grid max-w-[1440px] gap-14 px-6 py-20 lg:grid-cols-[1.08fr_.92fr] lg:px-12 lg:py-28"><div><div className="eyebrow !text-[#F3F0E8]/60"><span className="vermilion-dot"/> A local room for public thought</div><h1 className="mt-7 max-w-[800px] font-serif text-6xl leading-[.89] tracking-[-.06em] lg:text-[8rem]">Nagaon Debate & <em>Discussion Club.</em></h1><p className="mt-8 max-w-[500px] font-sans text-[15px] leading-7 text-[#F3F0E8]/65">A recurring gathering for people who would rather think together than agree quickly. We meet in Nagaon to make space for questions that deserve a room.</p><div className="mt-9 flex flex-wrap gap-3"><button onClick={() => setMemberOpen(true)} className="button-vermilion">Sign in for club updates <ArrowUpRight size={16}/></button><button onClick={openApplication} disabled={Boolean(event && event.registrationOpen === 0)} className="button-outline !border-[#F3F0E8]/30 !text-[#F3F0E8]">Apply for a debate role <ArrowUpRight size={16}/></button></div></div><div className="overflow-hidden border border-[#F3F0E8]/20 bg-[#2D2B27] lg:min-h-[450px]"><div className="relative h-[250px] overflow-hidden border-b border-[#F3F0E8]/15 lg:h-[285px]">{event?.imageUrl ? <img src={event.imageUrl} alt="" className="h-full w-full object-cover opacity-75"/> : <div className="flex h-full items-start justify-end p-6"><span className="font-serif text-8xl leading-none text-[#C8472C]/50">N</span></div>}</div><div className="p-6 lg:p-8"><div className="eyebrow !text-[#F3F0E8]/55"><span className="vermilion-dot"/> Next gathering</div><h2 className="mt-5 max-w-[360px] font-serif text-5xl leading-[.93]">{event?.title ?? "The next question is taking shape."}</h2><p className="mt-5 max-w-[300px] font-sans text-sm leading-6 text-[#F3F0E8]/55">{event?.description ?? "The next debate topic, reading note, and room details will appear here."}</p></div></div></div></section>
    <section className="bg-[#EAE5DA] px-6 py-16 text-[#171614] lg:px-12 lg:py-24"><div className="mx-auto max-w-[1440px]"><div className="eyebrow"><span className="vermilion-dot"/> Keep the date</div><div className="mt-8 grid border-l border-t border-[#171614]/20 sm:grid-cols-3"><div className="border-b border-r border-[#171614]/20 p-7"><CalendarDays className="text-[#C8472C]" size={22}/><p className="mt-8 font-sans text-[10px] uppercase tracking-[0.13em] text-[#171614]/50">Date</p><p className="mt-2 font-serif text-3xl">{dateLabel}</p><p className="mt-1 font-sans text-sm text-[#171614]/60">{timeLabel}</p></div><div className="border-b border-r border-[#171614]/20 p-7"><MapPin className="text-[#C8472C]" size={22}/><p className="mt-8 font-sans text-[10px] uppercase tracking-[0.13em] text-[#171614]/50">Venue</p><p className="mt-2 font-serif text-3xl">{event?.venue ?? "To be announced"}</p><p className="mt-1 font-sans text-sm text-[#171614]/60">Nagaon, Assam</p></div><div className="border-b border-r border-[#171614]/20 p-7"><Users className="text-[#C8472C]" size={22}/><p className="mt-8 font-sans text-[10px] uppercase tracking-[0.13em] text-[#171614]/50">Applications</p><p className="mt-2 font-serif text-3xl">{event?.registrationOpen === 0 ? "Closed" : "Open now"}</p><p className="mt-1 font-sans text-sm text-[#171614]/60">Debators and debate bodies welcome.</p></div></div><p className="mt-8 max-w-[620px] font-sans text-sm leading-7 text-[#171614]/65">Venue, date, topic, and application updates are managed from the Editorial Desk and appear here automatically.</p></div></section>
    <section className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12 lg:py-28"><div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><div className="eyebrow !text-[#F3F0E8]/55"><span className="vermilion-dot"/> The club note</div><p className="mt-6 font-sans text-sm leading-7 text-[#F3F0E8]/55">The club is a companion to the index: more local, more conversational, and deliberately unfinished.</p></div><blockquote className="border-t border-[#F3F0E8]/20 pt-6 font-serif text-4xl leading-[.98] tracking-[-.035em] lg:text-6xl">“A discussion is not a performance of certainty. It is a way of finding out what we actually think.”</blockquote></div></section>
    {memberOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171614]/80 px-5" onClick={() => setMemberOpen(false)}><div className="w-full max-w-[480px] bg-[#F3F0E8] p-7 text-[#171614] lg:p-10" onClick={(event) => event.stopPropagation()}><div className="eyebrow"><span className="vermilion-dot"/> Club access</div><h2 className="mt-5 font-serif text-5xl leading-none">Keep a seat<br/><em>in the room.</em></h2><p className="mt-5 font-sans text-sm leading-6 text-[#171614]/60">{user ? "You are signed in. Join the club to receive venue, date, and reading-list updates." : "Sign in or create your account to receive Nagaon Club updates and reserve your place in the room."}</p><div className="mt-7 grid gap-3"><button onClick={joinClub} disabled={joinMutation.isPending} className="button-vermilion justify-center">{user ? "Join the club" : "Sign in / create account"} <ArrowUpRight size={14}/></button></div><button className="mt-6 font-sans text-[10px] uppercase tracking-[0.13em] text-[#171614]/50 underline" onClick={() => setMemberOpen(false)}>Close</button></div></div>}
    {applicationOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171614]/80 px-5" onClick={() => setApplicationOpen(false)}><form onSubmit={submitApplication} className="w-full max-w-[560px] bg-[#F3F0E8] p-7 text-[#171614] lg:p-10" onClick={(event) => event.stopPropagation()}><div className="eyebrow"><span className="vermilion-dot"/> Debate application</div><h2 className="mt-5 font-serif text-5xl leading-none">Choose your place<br/><em>in the room.</em></h2><p className="mt-4 font-sans text-sm leading-6 text-[#171614]/60">Applying for: <strong>{event?.title ?? "the next Nagaon Club debate"}</strong></p><label className="mt-7 block font-sans text-xs font-semibold uppercase tracking-[.12em]">Role<select value={role} onChange={(change) => setRole(change.target.value as Role)} className="mt-2 h-11 w-full border border-[#171614]/20 bg-[#EAE5DA] px-3 font-sans text-sm normal-case tracking-normal">{roles.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>{role === "other" && <label className="mt-4 block font-sans text-xs font-semibold uppercase tracking-[.12em]">Describe the role<input required value={otherRole} onChange={(change) => setOtherRole(change.target.value)} className="mt-2 h-11 w-full border border-[#171614]/20 bg-[#EAE5DA] px-3 font-sans text-sm normal-case tracking-normal" placeholder="e.g. evidence coordinator"/></label>}<label className="mt-4 block font-sans text-xs font-semibold uppercase tracking-[.12em]">Note to the organisers<textarea value={note} onChange={(change) => setNote(change.target.value)} className="mt-2 min-h-[120px] w-full border border-[#171614]/20 bg-[#EAE5DA] p-3 font-sans text-sm normal-case tracking-normal" placeholder="Tell us about your interest or experience"/></label><div className="mt-6 flex flex-wrap gap-3"><button type="submit" disabled={applicationMutation.isPending} className="button-vermilion">{applicationMutation.isPending ? "Sending…" : "Send application"}</button><button type="button" onClick={() => setApplicationOpen(false)} className="button-outline">Cancel</button></div></form></div>}
  <ThinkoriaFooter /></main>;
}
