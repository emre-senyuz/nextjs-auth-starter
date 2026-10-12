"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, LoaderCircle } from "lucide-react";

export function SignOut() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  return <div><button className="signout" disabled={pending} onClick={async () => {
    setPending(true); setError(false);
    try { await signOut({ callbackUrl: "/login" }); }
    catch { setError(true); setPending(false); }
  }}>{pending ? <LoaderCircle size={16} className="animate-spin" /> : <LogOut size={16} />} {pending ? "Signing out…" : "Sign out"}</button>{error && <p className="field-error" role="alert">Sign-out failed. Try again.</p>}</div>;
}
