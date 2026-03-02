import { Inter, Montserrat } from "next/font/google";
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
  description: "PeerPull is a peer exchange platform where builders trade honest feedback. Give a review, get a review. ",
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
              toast: "!bg-[#1a1f2e] !border-[#2d3348]",
              title: "!text-gray-100",
              description: "!text-gray-400",
              closeButton: "!bg-[#2d3348] !border-[#3d4458] !text-gray-400",
            },
          }}
        />
      </body>
    </html>
  );
}
