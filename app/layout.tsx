import { Inter, Montserrat } from "next/font/google";
import { SidebarProvider } from "@/context/SidebarContext";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata = {
  title: "PeerPull - Valuable Feedback Early!",
  description: "Valueable Feedback Exchange For Builders to Validate Ideas Early.",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="font-inter bg-dark-bg text-dark-text antialiased" suppressHydrationWarning>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
