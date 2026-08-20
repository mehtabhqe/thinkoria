import { ArrowUpRight, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { trpc } from "@/lib/trpc";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: result => {
      setMessage(result.alreadySubscribed ? "You’re already on the list." : "You’re in. Watch your inbox for the next note.");
      setEmail("");
    },
    onError: error => setMessage(error.message || "We couldn’t save that address. Please try again."),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }
    setMessage(null);
    subscribe.mutate({ email: normalizedEmail });
  };

  return (
    <section id="newsletter" className="border-t border-[#F3F0E8]/15 bg-[#171614] px-6 py-16 text-[#F3F0E8] lg:px-12 lg:py-20">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
        <div>
          <div className="eyebrow !text-[#F3F0E8]/60"><span className="vermilion-dot" /> The quiet dispatch</div>
          <h2 className="mt-5 max-w-[560px] font-serif text-5xl leading-[.92] tracking-[-.045em] lg:text-6xl">Ideas worth <em>returning to.</em></h2>
        </div>
        <div className="lg:pl-10">
          <p className="max-w-[510px] font-sans text-[15px] leading-7 text-[#F3F0E8]/65">A considered note when a new paper, conversation, or gathering enters the room. No noise. Just the work worth reading.</p>
          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3 sm:flex-row" noValidate>
            <label className="sr-only" htmlFor="newsletter-email">Email address</label>
            <div className="flex min-w-0 flex-1 items-center gap-3 border border-[#F3F0E8]/25 px-4 py-3 focus-within:border-[#C8472C]">
              <Mail size={16} className="shrink-0 text-[#C8472C]" aria-hidden="true" />
              <input id="newsletter-email" name="email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="Your email address" className="min-w-0 flex-1 bg-transparent font-sans text-sm text-[#F3F0E8] outline-none placeholder:text-[#F3F0E8]/40" />
            </div>
            <button type="submit" disabled={subscribe.isPending} className="button-vermilion justify-center disabled:cursor-not-allowed disabled:opacity-60">{subscribe.isPending ? "Saving…" : "Join the list"} <ArrowUpRight size={16} /></button>
          </form>
          <p aria-live="polite" className={`mt-3 min-h-5 font-sans text-xs ${message?.startsWith("You") ? "text-[#C9D5B5]" : "text-[#F3F0E8]/55"}`}>{message}</p>
        </div>
      </div>
    </section>
  );
}
