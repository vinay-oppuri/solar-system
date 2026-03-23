import type { Metadata } from "next";
import { Inter, Orbitron, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });

export const metadata: Metadata = {
    title: "Solar System Explorer",
    description: "A cinematic, space-exploration website powered by Three.js",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${orbitron.variable} ${spaceMono.variable} antialiased`}>
            <body className="font-sans bg-spaceBlack text-starWhite overflow-hidden selection:bg-accent selection:text-spaceBlack">
                {children}
            </body>
        </html>
    );
}
