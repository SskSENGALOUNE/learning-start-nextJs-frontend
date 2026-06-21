import Link from "next/link";

const pages = [
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/customer", label: "Customers" },
  { href: "/bank-accounts/compare", label: "Bank Accounts (Offset vs Cursor)" },
  { href: "/bank-accounts/benchmark", label: "Benchmark (Compare 4 method)" },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Frontend Practice</h1>
      <ul className="flex flex-col gap-3">
        {pages.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {p.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
