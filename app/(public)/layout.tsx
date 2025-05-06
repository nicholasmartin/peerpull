import { Navbar } from "@/components/public/layout/Navbar";
import { Footer } from "@/components/public/layout/Footer";
import { createClient } from "@/utils/supabase/server";
import { ThemeProvider } from "@/context/ThemeContext";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get user data for conditional rendering in navbar
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <ThemeProvider isProtected={false}>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
