import ThinkoriaFooter from "@/components/ThinkoriaFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { isVercelPreview, ManusHandoffNotice } from "@/lib/manusHandoff";
import { fileToBase64 } from "@/lib/fileToBase64";
import { ArrowLeft, ArrowUpRight, Check, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import PublicMobileMenu from "@/components/PublicMobileMenu";
import ThemeToggle from "@/components/ThemeToggle";
import { toast } from "sonner";

const fields = ["Philosophy", "Politics", "Literature", "Media", "Gaming", "Science", "Technology", "Religion", "Linguistics", "Society", "History", "Art & Design"];

export default function Submit() {
  const [form, setForm] = useState({ name: "", email: "", title: "", category: "Philosophy", abstract: "" });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const previewOnly = isVercelPreview();
  const uploadMutation = trpc.uploads.file.useMutation();
  const submitMutation = trpc.submissions.create.useMutation({ onSuccess: () => setSubmitted(true), onError: (error) => toast.error(error.message) });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      let manuscriptUrl = "";
      if (file) {
        const data = await fileToBase64(file);
        const uploaded = await uploadMutation.mutateAsync({ fileName: file.name, contentType: file.type || "application/octet-stream", data });
        manuscriptUrl = uploaded.url;
      }
      await submitMutation.mutateAsync({ ...form, manuscriptUrl });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We could not receive the submission.");
    }
  };

  return <main className="thinkoria-site min-h-screen bg-[#F3F0E8] text-[#171614]"><header className="border-b border-[#171614]/15"><div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 lg:px-12"><Link href="/" className="flex items-center gap-3"><img src="/manus-storage/thinkoria-logo_8998c7d8.png" alt="Thinkoria" className="h-12 w-28 object-contain object-left"/></Link><div className="flex items-center gap-5"><ThemeToggle /><Link href="/" className="inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-[.13em] text-[#171614]/55 hover:text-[#C8472C]"><ArrowLeft size={14}/> Home</Link><PublicMobileMenu links={[{ href: "/about", label: "About" }, { href: "/catalogue", label: "Catalogue" }, { href: "/club", label: "Nagaon Club" }, { href: "/forum", label: "Forum" }]} /></div></div></header><section className="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 lg:grid-cols-[.7fr_1.3fr] lg:px-12 lg:py-24"><div><p className="eyebrow"><span className="vermilion-dot"/> For contributors</p><h1 className="mt-7 font-serif text-6xl leading-[.88] tracking-[-.055em] lg:text-[7rem]">Send the work.<br/><em>We’ll read closely.</em></h1><p className="mt-7 max-w-[360px] font-sans text-sm leading-7 text-[#171614]/65">Submit a paper, essay, review, or working thought for consideration. A short abstract helps us understand the question your work is carrying.</p></div>{submitted ? <div className="flex flex-col justify-center border border-[#171614]/20 bg-[#EAE5DA] p-8 lg:p-12"><div className="flex h-12 w-12 items-center justify-center bg-[#C8472C] text-[#F3F0E8]"><Check size={22}/></div><h2 className="mt-7 font-serif text-5xl leading-none">The work is in the room.</h2><p className="mt-5 max-w-[460px] font-sans text-sm leading-7 text-[#171614]/65">Thank you for sending it. Our editorial desk will review the submission and contact you at the address provided.</p><Link href="/catalogue" className="button-ink mt-8 inline-flex w-fit">Return to the catalogue <ArrowUpRight size={14}/></Link></div> : previewOnly ? <ManusHandoffNotice action="send a paper" /> : <form onSubmit={submit} className="border border-[#171614]/20 bg-[#EAE5DA] p-6 lg:p-10"><div className="grid gap-5 sm:grid-cols-2"><label className="font-sans text-xs font-semibold uppercase tracking-[.12em]">Your name<Input required value={form.name} onChange={(event) => update("name", event.target.value)} className="mt-2 bg-[#F3F0E8] font-sans text-sm normal-case tracking-normal"/></label><label className="font-sans text-xs font-semibold uppercase tracking-[.12em]">Email address<Input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className="mt-2 bg-[#F3F0E8] font-sans text-sm normal-case tracking-normal"/></label><label className="font-sans text-xs font-semibold uppercase tracking-[.12em] sm:col-span-2">Paper title<Input required value={form.title} onChange={(event) => update("title", event.target.value)} className="mt-2 bg-[#F3F0E8] font-serif text-xl normal-case tracking-normal"/></label><label className="font-sans text-xs font-semibold uppercase tracking-[.12em]">Field<select value={form.category} onChange={(event) => update("category", event.target.value)} className="mt-2 h-10 w-full border border-[#171614]/20 bg-[#F3F0E8] px-3 font-sans text-sm font-normal normal-case tracking-normal">{fields.map((field) => <option key={field}>{field}</option>)}</select></label><label className="font-sans text-xs font-semibold uppercase tracking-[.12em]">Manuscript file<span className="mt-2 flex h-10 cursor-pointer items-center gap-2 border border-dashed border-[#171614]/30 bg-[#F3F0E8] px-3 font-sans text-xs font-normal normal-case tracking-normal hover:border-[#C8472C]"><Upload size={14} className="text-[#C8472C]"/>{file ? file.name : "Choose PDF or document"}<input type="file" accept=".pdf,.doc,.docx,.txt" className="sr-only" onChange={(event) => setFile(event.target.files?.[0] ?? null)}/></span></label><label className="font-sans text-xs font-semibold uppercase tracking-[.12em] sm:col-span-2">Abstract / note<Textarea required minLength={20} value={form.abstract} onChange={(event) => update("abstract", event.target.value)} className="mt-2 min-h-[150px] bg-[#F3F0E8] font-sans text-sm normal-case tracking-normal" placeholder="What is the work asking?"/></label></div><Button type="submit" disabled={submitMutation.isPending || uploadMutation.isPending} className="button-vermilion mt-7">{submitMutation.isPending || uploadMutation.isPending ? <Loader2 className="animate-spin" size={15}/> : "Send to the editorial desk"} <ArrowUpRight size={15}/></Button><p className="mt-4 font-sans text-[10px] leading-5 text-[#171614]/50">Files are stored securely. Please keep submissions under 10 MB.</p></form>}</section><ThinkoriaFooter /></main>;
}
