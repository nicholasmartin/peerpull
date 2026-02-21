import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return redirect("/dashboard");
  }

  const navItems = [
    { name: "Overview", href: "/dashboard/admin" },
    { name: "Point Economy", href: "/dashboard/admin/economy" },
    { name: "Queue Settings", href: "/dashboard/admin/queue" },
    { name: "Review Settings", href: "/dashboard/admin/reviews" },
    { name: "Users", href: "/dashboard/admin/users" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage system settings, users, and monitor platform health
        </p>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg whitespace-nowrap transition-colors border-b-2 border-transparent hover:border-blue-500"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
