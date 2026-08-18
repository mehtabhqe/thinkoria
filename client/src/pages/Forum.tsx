import ThinkoriaFooter from "@/components/ThinkoriaFooter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { isVercelPreview, manusHref } from "@/lib/manusHandoff";
import { ArrowUpRight, Eye, LockKeyhole, Plus, Users, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Forum() {
  const { user } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [postBody, setPostBody] = useState("");
  const [threadTitle, setThreadTitle] = useState("");
  const [threadBody, setThreadBody] = useState("");
  const [threadCategory, setThreadCategory] = useState("General");
  const forumThreadsQuery = trpc.forum.threads.useQuery();
  const postsQuery = trpc.forum.posts.useQuery({ threadId: selectedThreadId ?? 0 }, { enabled: selectedThreadId !== null });
  const trpcUtils = trpc.useUtils();
  const createThreadMutation = trpc.forum.createThread.useMutation({
    onSuccess: async () => {
      toast.success("Thread started");
      setThreadTitle("");
      setThreadBody("");
      setThreadCategory("General");
      setAccountOpen(false);
      await trpcUtils.forum.threads.invalidate();
    },
    onError: error => toast.error(error.message),
  });

  const openAccount = () => {
    if (isVercelPreview()) {
      window.location.href = manusHref("/forum");
      return;
    }
    if (!user) {
      startLogin();
      return;
    }
    setAccountOpen(true);
  };

  const submitThread = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      startLogin();
      return;
    }
    createThreadMutation.mutate({ title: threadTitle.trim(), body: threadBody.trim(), category: threadCategory });
  };

  const threads = forumThreadsQuery.data ?? [];
  const selectedThread = threads.find(({ thread }) => thread.id === selectedThreadId);
  const createPostMutation = trpc.forum.createPost.useMutation({
    onSuccess: async () => {
      toast.success("Reply added");
      setPostBody("");
      await trpcUtils.forum.posts.invalidate({ threadId: selectedThreadId ?? 0 });
    },
    onError: error => toast.error(error.message),
  });

  return (
    <main className="min-h-screen bg-[#F3F0E8] text-[#171614]">
      <header className="border-b border-[#171614]/15">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 lg:px-12">
          <a href="/" className="flex items-center gap-3"><img src="/manus-storage/thinkoria-logo_8998c7d8.png" alt="" className="h-9 w-9 object-contain" /><span className="font-serif text-[21px] leading-none tracking-[-0.035em]">Thinkoria</span></a>
          <div className="flex items-center gap-5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em]"><a href="/catalogue" className="hidden sm:block nav-link">Catalogue</a><a href="/club" className="hidden sm:block nav-link">Nagaon Club</a><button onClick={openAccount} className="button-ink">{user ? "Start a thread" : "Create account"} <ArrowUpRight size={14} /></button></div>
        </div>
      </header>
      <section className="mx-auto max-w-[1440px] px-6 pb-14 pt-16 lg:px-12 lg:pb-20 lg:pt-24"><div className="grid gap-10 lg:grid-cols-[1fr_.65fr] lg:items-end"><div><div className="eyebrow"><span className="vermilion-dot" /> The forum / open conversation</div><h1 className="mt-7 max-w-[760px] font-serif text-6xl leading-[.9] tracking-[-.055em] lg:text-8xl">A place to <em>think out loud.</em></h1></div><div className="border-l border-[#171614]/20 pl-6"><p className="font-sans text-sm leading-7 text-[#171614]/65">Come with a question. Stay for the complication. The forum is a member space for conversations that do not need to resolve themselves quickly.</p><button onClick={openAccount} className="button-vermilion mt-7">{user ? "Start a thread" : "Join the conversation"} <ArrowUpRight size={15} /></button></div></div></section>
      <section className="border-y border-[#171614]/15 bg-[#EAE5DA] px-6 py-5 lg:px-12"><div className="mx-auto flex max-w-[1440px] items-center justify-between"><div className="flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.14em] text-[#171614]/55"><Users size={15} className="text-[#C8472C]" /> Member conversations</div><div className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#171614]/50">Persisted discussions</div></div></section>
      <section className="mx-auto max-w-[1440px] px-6 py-14 lg:px-12 lg:py-20"><div className="grid gap-14 lg:grid-cols-[1fr_.34fr]"><div><div className="mb-6 flex items-center justify-between"><div className="eyebrow"><span className="vermilion-dot" /> Recent threads</div><button onClick={openAccount} className="hidden items-center gap-2 font-sans text-[10px] uppercase tracking-[0.12em] sm:flex">Start a thread <Plus size={14} /></button></div><div className="border-t border-[#171614]/20">{forumThreadsQuery.isLoading ? <div className="py-16 text-center font-sans text-sm text-[#171614]/55">Opening the conversation room…</div> : forumThreadsQuery.isError ? <div className="border-b border-[#171614]/20 py-16 text-center"><p className="font-serif text-3xl">The room is temporarily quiet.</p><p className="mt-3 font-sans text-sm text-[#171614]/55">We could not load the latest discussions. Please try again.</p><button onClick={() => forumThreadsQuery.refetch()} className="mt-5 font-sans text-[10px] uppercase tracking-[.13em] underline decoration-[#C8472C] underline-offset-4">Try again</button></div> : threads.length === 0 ? <div className="border-b border-[#171614]/20 py-16 text-center"><p className="font-serif text-3xl">Be the first question in the room.</p><p className="mt-3 font-sans text-sm text-[#171614]/55">Start a discussion and make space for another mind.</p><button onClick={openAccount} className="button-vermilion mt-6">Start a thread <Plus size={14} /></button></div> : threads.map(({ thread, author }) => <button onClick={() => setSelectedThreadId(thread.id)} key={thread.id} className="group grid w-full gap-5 border-b border-[#171614]/20 py-7 text-left transition-colors hover:bg-[#EAE5DA] sm:grid-cols-[.18fr_1fr_.18fr] sm:px-4"><div className="font-sans text-[10px] uppercase tracking-[0.13em] text-[#C8472C]">{thread.category}</div><div><h2 className="font-serif text-3xl leading-none tracking-[-.025em] transition-colors group-hover:text-[#C8472C]">{thread.title}</h2><p className="mt-3 font-sans text-[10px] uppercase tracking-[0.12em] text-[#171614]/50">{author.name ?? author.email ?? "A member of the room"} <span className="mx-2 text-[#C8472C]">/</span> {new Date(thread.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</p></div><div className="flex items-end justify-between font-sans text-[10px] uppercase tracking-[0.12em] text-[#171614]/50 sm:flex-col sm:items-end"><span className="inline-flex items-center gap-2"><Eye size={13} /> {thread.viewCount.toLocaleString()} views</span><ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div></button>)}</div></div><aside className="border-t border-[#171614]/20 pt-5"><div className="eyebrow"><span className="vermilion-dot" /> Before you post</div><p className="mt-6 font-serif text-3xl leading-none">Make room for another mind.</p><p className="mt-5 font-sans text-sm leading-6 text-[#171614]/60">The forum is account-only so every participant has a name, a place to return to, and a stake in the quality of the room.</p><button onClick={openAccount} className="mt-7 inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-[0.13em] underline decoration-[#C8472C] decoration-2 underline-offset-8">{user ? "Start a thread" : "Create your account"} <ArrowUpRight size={14} /></button></aside></div></section>
      {selectedThread && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171614]/80 px-5" onClick={() => { setSelectedThreadId(null); setPostBody(""); }}><article className="max-h-[85vh] w-full max-w-[680px] overflow-y-auto bg-[#F3F0E8] p-7 text-[#171614] lg:p-10" onClick={event => event.stopPropagation()}><div className="flex items-start justify-between"><div className="eyebrow"><span className="vermilion-dot" /> {selectedThread.thread.category}</div><button onClick={() => setSelectedThreadId(null)} aria-label="Close discussion"><X size={18} /></button></div><h2 className="mt-6 font-serif text-5xl leading-none">{selectedThread.thread.title}</h2><p className="mt-4 font-sans text-[10px] uppercase tracking-[.12em] text-[#171614]/50">{selectedThread.author.name ?? selectedThread.author.email ?? "A member of the room"} · {new Date(selectedThread.thread.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p><p className="mt-8 whitespace-pre-wrap font-sans text-base leading-8 text-[#171614]/75">{selectedThread.thread.body}</p><div className="mt-9 border-t border-[#171614]/15 pt-6"><div className="eyebrow"><span className="vermilion-dot" /> Replies</div>{postsQuery.isLoading ? <p className="mt-5 font-sans text-sm text-[#171614]/55">Loading replies…</p> : postsQuery.isError ? <p className="mt-5 font-sans text-sm text-[#C8472C]">Replies could not be loaded. Close and try again.</p> : postsQuery.data?.length ? <div className="mt-5 grid gap-4">{postsQuery.data.map(({ post, author }) => <div key={post.id} className="border-l-2 border-[#C8472C] pl-4"><p className="font-sans text-[10px] uppercase tracking-[.12em] text-[#171614]/50">{author.name ?? author.email ?? "A member"} · {new Date(post.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p><p className="mt-2 whitespace-pre-wrap font-sans text-sm leading-7 text-[#171614]/75">{post.body}</p></div>)}</div> : <p className="mt-5 font-sans text-sm text-[#171614]/55">No replies yet. Be the first to continue the thought.</p>}</div>{user ? <form onSubmit={event => { event.preventDefault(); createPostMutation.mutate({ threadId: selectedThread.thread.id, body: postBody.trim() }); }} className="mt-7 grid gap-3"><textarea required minLength={10} maxLength={5000} value={postBody} onChange={event => setPostBody(event.target.value)} placeholder="Add your perspective" className="min-h-[120px] border border-[#171614]/20 bg-transparent p-3 font-sans text-sm outline-none focus:border-[#C8472C]" /><button disabled={createPostMutation.isPending} className="button-vermilion w-fit">{createPostMutation.isPending ? "Adding reply…" : "Add reply"} <ArrowUpRight size={14} /></button></form> : <button onClick={openAccount} className="button-vermilion mt-8">Join the conversation <ArrowUpRight size={14} /></button>}</article></div>}
      {accountOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171614]/80 px-5" onClick={() => setAccountOpen(false)}><div className="w-full max-w-[520px] bg-[#F3F0E8] p-7 text-[#171614] lg:p-10" onClick={event => event.stopPropagation()}><div className="eyebrow"><LockKeyhole size={14} className="text-[#C8472C]" /> {user ? "Start a thread" : "Account required"}</div><h2 className="mt-5 font-serif text-5xl leading-none">{user ? <>Put a question<br /><em>into the room.</em></> : <>The room opens<br /><em>when you sign in.</em></>}</h2>{user ? <form onSubmit={submitThread} className="mt-7 grid gap-4"><input required minLength={5} maxLength={240} value={threadTitle} onChange={event => setThreadTitle(event.target.value)} placeholder="Thread title" className="h-11 border border-[#171614]/20 bg-transparent px-3 font-serif text-xl outline-none focus:border-[#C8472C]" /><select value={threadCategory} onChange={event => setThreadCategory(event.target.value)} className="h-10 border border-[#171614]/20 bg-transparent px-3 font-sans text-sm outline-none focus:border-[#C8472C]"><option>General</option><option>Philosophy</option><option>Politics</option><option>Literature</option><option>Media</option><option>Technology</option></select><textarea required minLength={20} value={threadBody} onChange={event => setThreadBody(event.target.value)} placeholder="What would you like to ask?" className="min-h-[150px] border border-[#171614]/20 bg-transparent p-3 font-sans text-sm outline-none focus:border-[#C8472C]" /><button disabled={createThreadMutation.isPending} className="button-vermilion justify-center">{createThreadMutation.isPending ? "Publishing…" : "Publish thread"} <ArrowUpRight size={14} /></button></form> : <><p className="mt-5 font-sans text-sm leading-6 text-[#171614]/60">Create an account or sign in to join threads, start discussions, and keep track of the ideas you care about.</p><button onClick={openAccount} className="button-vermilion mt-7 w-full justify-center">Sign in / create account <ArrowUpRight size={14} /></button></>}<button className="mt-6 font-sans text-[10px] uppercase tracking-[0.13em] text-[#171614]/50 underline" onClick={() => setAccountOpen(false)}>Close</button></div></div>}
    </main>
  );
}
