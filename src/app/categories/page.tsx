"use client";

import { useState } from "react";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";

export default function CategoriesPage() {
    const [keyword, setKeyword] = useState("");
    const { data, loading, error } = useCategories(keyword);

    return (
        <main>
            <h1>Categories</h1>
            <Link href="/categories/new">+ Create Category</Link>

            <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="ค้นหา category..."
            />

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <ul>
                {data.map((c) => (
                    <li key={c.id}>{c.name}</li>
                ))}
            </ul>
        </main>
    );
}
