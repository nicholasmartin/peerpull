import { Inter, Montserrat } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { Toaster } from "sonner";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata = {
  title: "PeerPull - Real feedback from Real Builders.",
  description: "PeerPull is a peer exchange platform where builders trade honest feedback. Give feedback, get feedback.",
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
    <html lang="en" className={`${inter.variable} ${montserrat.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="font-inter bg-dark-bg text-dark-text antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
          <Toaster
            theme="dark"
            position="bottom-right"
            richColors
            closeButton
            visibleToasts={3}
            duration={5000}
            toastOptions={{
              classNames: {
                toast: "!bg-dark-card !border-dark-border",
                title: "!text-dark-text",
                description: "!text-dark-text-muted",
                closeButton: "!bg-dark-surface !border-dark-border !text-dark-text-muted",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
