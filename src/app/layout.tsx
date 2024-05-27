import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next app template aws-amplify",
  description: "Next app template aws-amplify",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="w-full max-h-dvh min-h-dvh">
      <body className={` w-full max-h-full min-h-full`}>{children}</body>
    </html>
  );
}
