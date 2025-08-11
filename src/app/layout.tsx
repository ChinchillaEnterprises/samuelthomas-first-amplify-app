import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@aws-amplify/ui-react/styles.css";
import "./globals.css";
import ConfigureAmplifyClientSide from "./amplify-config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ContextChef - Smart Meal Planning",
  description: "Plan meals that fit your pantry, budget, and dietary preferences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigureAmplifyClientSide />
        {children}
      </body>
    </html>
  );
}
