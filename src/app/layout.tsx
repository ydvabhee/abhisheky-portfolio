import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import metadataJson from "@/data/metadata.json";

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
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-black text-black dark:text-white antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
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
