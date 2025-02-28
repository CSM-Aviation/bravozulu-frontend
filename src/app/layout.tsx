import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { UserProvider } from "./contexts/UserContext";
import NavigationBar from "./components/NavigationBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Bravo Zulu Services - Aircraft, Automotive & Vessel Detailing',
  description: 'Professional detailing services for aircraft, automobiles, and vessels in Fresno, CA',
  icons: {
    icon: '/BravoZulu_logo.avif',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProvider>
          <NavigationBar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}