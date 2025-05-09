import { Inter } from "next/font/google";
import { SidebarProvider } from "@/context/SidebarContext";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "PeerPull - Get Valuable Feedback Early!",
  description: "Valueable Feedback Exchange For Startup Founders to Validate Ideas Early.",
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
      // Check stored theme preference first
      const storedTheme = localStorage.getItem('theme');
      
      if (storedTheme) {
        if (storedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (storedTheme === 'light') {
          document.documentElement.classList.remove('dark');
        } else if (storedTheme === 'system') {
          // Apply theme based on system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      } else {
        // No stored preference, use route-based default
        const isProtectedRoute = window.location.pathname.startsWith('/dashboard');
        if (isProtectedRoute) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <Script id="dark-mode-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: darkModeScript }} />
      </head>
      <body className="font-inter">
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
