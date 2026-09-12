import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yousuf Hassan | Software Engineer & Competitive Programmer",
  description:
    "Portfolio of Yousuf Hassan — Software Engineer, Competitive Programmer, and CS Student at IUBAT. Explore my projects, skills, and achievements.",
  keywords: [
    "Yousuf Hassan",
    "Software Engineer",
    "Competitive Programmer",
    "Portfolio",
    "Web Developer",
    "IUBAT",
  ],
  openGraph: {
    title: "Yousuf Hassan | Software Engineer & Competitive Programmer",
    description:
      "Explore my projects, skills, and achievements in software development and competitive programming.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-urbanist bg-bg_primary">{children}</body>
    </html>
  );
}
