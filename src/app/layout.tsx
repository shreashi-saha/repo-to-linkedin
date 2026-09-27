import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Repo-to-LinkedIn | Turn GitHub Projects into Professional Posts",
  description:
    "Analyze your public GitHub repository README.md with Google Gemini AI and generate a polished, professional LinkedIn post ready to copy.",
  keywords: [
    "GitHub",
    "LinkedIn",
    "Developer Tools",
    "AI Post Generator",
    "Gemini AI",
    "README analyzer",
  ],
  authors: [{ name: "Repo-to-LinkedIn" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
