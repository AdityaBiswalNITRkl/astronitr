import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import SpaceBackground from "@/components/SpaceBackground";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASTRONITR – Astronomy & Space Club | NIT Rourkela",
  description:
    "ASTRONITR is the official Astronomy & Space Club of NIT Rourkela. Explore events, stargazing sessions, workshops, and more.",
  keywords: ["ASTRONITR", "NIT Rourkela", "Astronomy Club", "Space Club", "Stargazing"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${inter.variable} h-full`}
    >
      <body
        className="min-h-full flex flex-col antialiased"
        style={{ background: "#050816", color: "#e2e8f0", fontFamily: "var(--font-inter), sans-serif" }}
      >
        <AuthProvider>
          <SpaceBackground />
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
