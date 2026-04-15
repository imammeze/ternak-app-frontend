import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ConditionalBottomNav from "@/shared/components/ConditionalBottomNav";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ternak App",
  description: "Sistem Manajemen Peternakan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster
          position="top-center"
          containerStyle={{
            zIndex: 9999999,
          }}
          reverseOrder={false}
        />
        <div className="bg-gray-200 min-h-screen flex justify-center font-sans">
          <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-2xl flex flex-col overflow-hidden">
            {children}

            <ConditionalBottomNav />
          </div>
        </div>
      </body>
    </html>
  );
}
