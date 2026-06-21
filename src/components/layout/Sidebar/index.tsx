"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/customer", label: "Customers" },
  { href: "/bank-accounts/compare", label: "Bank Accounts (Offset vs Cursor)" },
  { href: "/bank-accounts/benchmark", label: "Benchmark (Compare 4 method)" },
  { href: "/bank-accounts/composite", label: "Composite Filter" },
  { href: "/ui-component", label: "UI Component" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 min-h-screen bg-white border-r border-gray-100 px-4 py-6">
      <h2 className="px-2 mb-6 text-lg font-bold text-gray-900">
        Frontend Practice
      </h2>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
