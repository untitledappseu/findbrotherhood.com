import { Toaster } from "@/components/ui/sonner";
import { AptabaseProvider } from '@aptabase/react';
import { GeistSans } from "geist/font/sans";


import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "FindBrotherhood.com - Tired of being alone?",
  og: {
    title: "FindBrotherhood.com - Tired of being alone?",
    description: "Finally, connect with like-minded individuals on a self-improvement journey just like you, and meet them in real life—not just in front of your computer screen.",
    image: "https://framerusercontent.com/images/3LxQTxyFI1h3rAboDLdoS7F6BH8.png",
    url: new URL("/", defaultUrl),
  },
  description: "Finally, connect with like-minded individuals on a self-improvement journey just like you, and meet them in real life—not just in front of your computer screen.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">

          <Toaster position="top-center" />
          <AptabaseProvider appKey="A-EU-9059151670">{children}</AptabaseProvider>



        </main>
      </body>
    </html>
  );
}
