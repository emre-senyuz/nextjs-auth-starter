import { redirect } from "next/navigation";
import { Layers, ArrowUpRight, ShieldCheck, Check, Sparkles } from "lucide-react";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";

export const dynamic = "force-dynamic";
export default async function Login() {
  if (await getSession()) redirect("/dashboard");
  return <main className="login-shell">
    <section className="brand-panel" aria-label="Welcome to Auth Starter">
      <div className="brand"><span className="brand-icon"><Layers size={23} /></span>auth<span className="font-normal opacity-60">starter</span></div>
      <div className="brand-content"><span className="eyebrow"><span className="status-dot" /> A LITTLE LESS FRICTION</span><h1>Your next chapter.<br /><span>One sign-in away.</span></h1><p>A considered starting point for your next big idea. Step into your workspace and make yourself at home.</p>
        <div className="preview-card"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm"><span className="mini-icon"><Sparkles size={16} /></span>Your workspace</span><ArrowUpRight size={18} /></div><div className="preview-number">Room to grow<span>Built around you</span></div><div className="bars" aria-hidden="true">{[26, 40, 33, 53, 45, 63, 58, 80, 70, 93, 85, 110].map((height, i) => <div key={i} style={{ height }} />)}</div><div className="preview-footer"><span><span className="status-dot" /> Everything in its place</span><span>01 / 01</span></div></div>
      </div><div className="brand-footer"><span>Thoughtfully simple. Ready to explore.</span><span>© {new Date().getFullYear()} Auth Starter</span></div>
    </section>
    <section className="form-panel"><div className="top-note"><span className="tiny-pill">DEMO WORKSPACE</span></div><div className="form-content"><span className="welcome-icon"><ShieldCheck size={26} /></span><p className="eyebrow text-indigo-600! mt-7">GOOD TO SEE YOU</p><h2>Welcome back.</h2><p className="form-subtitle">Sign in to pick up where you left off.</p><LoginForm /><div className="demo-note"><div className="flex items-center gap-2 font-semibold text-slate-700"><Sparkles size={16} />Just exploring?</div><p>Use the demo account from the project README. This workspace is a local authentication demo.</p></div><div className="trust-note"><Check size={15} /> Session managed securely with NextAuth.js</div></div><footer className="form-footer">A small start. A world of possibilities.</footer></section>
  </main>;
}
