import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auth Starter — Your workspace, connected",
  description: "A local Next.js credentials authentication demo.",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
