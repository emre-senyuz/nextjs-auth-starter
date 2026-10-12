"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { ArrowRight, Eye, EyeOff, LoaderCircle, Mail, LockKeyhole, AlertCircle } from "lucide-react";
import { credentialsSchema } from "@/lib/credentials";

export function LoginForm() {
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError(""); setFields({});
    const data = new FormData(event.currentTarget);
    const parsed = credentialsSchema.safeParse({ email: data.get("email"), password: data.get("password") });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.message;
      setFields(errors); return;
    }
    setPending(true);
    try {
      const result = await signIn("credentials", { ...parsed.data, redirect: false, callbackUrl: "/dashboard" });
      if (!result?.ok || result.error) {
        setError("Unable to sign in. Check your demo email and password.");
        setPending(false); return;
      }
      window.location.assign("/dashboard");
    } catch {
      setError("We couldn’t connect. Please try again."); setPending(false);
    }
  }

  return <form onSubmit={submit} noValidate className="space-y-5">
    <div><label htmlFor="email">Email address</label><div className="input-wrap"><Mail size={18} aria-hidden="true" /><input id="email" name="email" type="email" autoComplete="username" placeholder="you@example.com" maxLength={254} required disabled={pending} aria-invalid={!!fields.email} aria-describedby={fields.email ? "email-error" : undefined} /></div>{fields.email && <p id="email-error" className="field-error">{fields.email}</p>}</div>
    <div><label htmlFor="password">Password</label><div className="input-wrap"><LockKeyhole size={18} aria-hidden="true" /><input id="password" name="password" type={visible ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" maxLength={72} required disabled={pending} aria-invalid={!!fields.password} aria-describedby={fields.password ? "password-error" : undefined} /><button type="button" className="eye-button" onClick={() => setVisible(!visible)} aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{fields.password && <p id="password-error" className="field-error">{fields.password}</p>}</div>
    {error && <div className="error-box" role="alert"><AlertCircle size={18} className="shrink-0" />{error}</div>}
    <button className="primary-button" type="submit" disabled={pending}>{pending ? <><LoaderCircle size={18} className="animate-spin" />Signing in…</> : <>Sign in to workspace<ArrowRight size={18} /></>}</button>
    <p aria-live="polite" className="sr-only">{pending ? "Signing in, please wait." : ""}</p>
  </form>;
}
