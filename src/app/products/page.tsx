"use client";

import { useProducts } from "@/hooks/useProducts";

export default function ProductsPage() {
    const { data, loading } = useProducts();

    if (loading) return <p>Loading...</p>;

    return (
        <main>
            <h1>Products</h1>
            <ul>
                {data.map((p) => (
                    <li key={p.id}>
                        {p.name} — ฿{p.price} (stock: {p.stock})
                    </li>
                ))}
            </ul>
        </main>
    );
}
