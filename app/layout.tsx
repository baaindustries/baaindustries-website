import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BAA Industries | Robotics Store",
  description:
    "Your one-stop shop for robotics kits, components, and supplies for hobbyists, students, researchers, and businesses.",
  keywords: "robotics, robot kits, components, hobbyist, education, research",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
