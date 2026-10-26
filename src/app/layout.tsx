import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import metadataJson from "@/data/metadata.json";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument" });

export const metadata: Metadata = {
  metadataBase: new URL('https://abhisheky.me'),
  title: metadataJson.site.title,
  description: metadataJson.site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="sage" suppressHydrationWarning className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=['sage','olive','apricot','cream'].indexOf(t)>-1?t:'sage'}catch(e){}" }} />
      </head>
      <body className="font-sans antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": metadataJson.hero.firstName + " " + metadataJson.hero.lastName,
              "url": "https://abhisheky.me",
              "jobTitle": metadataJson.hero.role,
              "sameAs": [
                metadataJson.contact.linkedin.url
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
