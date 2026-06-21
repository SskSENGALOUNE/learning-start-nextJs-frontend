"use client";

import Link from "next/link";
import { useCustomers } from "@/hooks/useCustomers";

export default function CustomersPage() {
    const { data, loading, error } = useCustomers();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <main>
            <h1>Customers</h1>
            <Link href="/customer/new">+ Create Customer</Link>
            <ul>
                {data.map((c) => (
                    <li key={c.id}>
                        {c.name} — {c.email}
                    </li>
                ))}
            </ul>
        </main>
    );
}
