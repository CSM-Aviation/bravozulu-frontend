import type { Metadata } from "next";
import { Manrope, Roboto, DM_Mono } from "next/font/google";
import "./globals.css";

import { UserProvider } from "./contexts/UserContext";
import NavigationBar from "./components/NavigationBar";

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-body",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Bravo Zulu Services - Aircraft, Automotive, RV & Vessel Detailing',
  description: 'Professional mobile detailing services for aircraft, automobiles, RVs, and vessels in Fresno, CA',
  icons: {
    icon: '/logo-bravo-zulu.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${roboto.variable} ${dmMono.variable} antialiased`}>
        <UserProvider>
          <NavigationBar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
