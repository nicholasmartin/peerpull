"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Overview", href: "/dashboard/admin" },
  { name: "Point Economy", href: "/dashboard/admin/economy" },
  { name: "Queue Settings", href: "/dashboard/admin/queue" },
  { name: "Review Settings", href: "/dashboard/admin/reviews" },
  { name: "Users", href: "/dashboard/admin/users" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-dark-border">
      {navItems.map((item) => {
        const isActive = item.href === "/dashboard/admin"
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-md whitespace-nowrap transition-colors border-b-2 ${
              isActive
                ? "text-dark-text bg-dark-surface border-primary"
                : "text-dark-text-muted border-transparent hover:text-dark-text hover:bg-dark-surface hover:border-primary"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
