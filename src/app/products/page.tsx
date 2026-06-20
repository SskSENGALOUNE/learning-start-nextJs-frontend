"use client";

import { useProducts } from "@/hooks/useProducts";
import Link from "next/link";

export default function ProductsPage() {
    const { data, meta, loading, params, updateParams } = useProducts();

    if (loading) return <p>Loading...</p>;


    return (
        <main>
             <h1>Products</h1>
            <ul>
                {data.map((p) => (
                    <li key={p.id}>
                        <Link href={`/products/${p.id}`}>
                            {p.name} — ฿{p.price} (stock: {p.stock})
                        </Link>
                    </li>
                ))}
            </ul>

            <div>
                <button
                    disabled={params.page <= 1}
                    onClick={() => updateParams({ page: params.page - 1 })}
                >
                    back
                </button>
                <span>
                    หน้า {meta?.page} / {meta?.totalPages}
                </span>
                <button
                    disabled={!meta || params.page >= meta.totalPages}
                    onClick={() => updateParams({ page: params.page + 1 })}
                >
                    ถัดไป
                </button>

            </div>
        </main>
    );
}
