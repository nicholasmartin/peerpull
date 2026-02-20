import { Inter, Montserrat } from "next/font/google";
import { SidebarProvider } from "@/context/SidebarContext";
import Script from "next/script";
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

// This script will be inlined in the HTML and run immediately
const darkModeScript = `
  (function() {
    try {
      // Always use dark mode for the entire application
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <Script id="dark-mode-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: darkModeScript }} />
      </head>
      <body className="font-inter bg-dark-bg text-dark-text antialiased">
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
