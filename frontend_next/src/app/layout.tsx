import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "FIP Game",
  description: "Cnam Game created by FIP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
