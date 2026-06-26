"use client";

import { useState } from "react";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { SkeletonList } from "@/components/ui/Skeleton";

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

            {error && <p>Error: {error}</p>}

            {loading ? (
                <SkeletonList rows={5} />
            ) : (
                <ul>
                    {data.map((c) => (
                        <li key={c.id}>{c.name}</li>
                    ))}
                </ul>
            )}
        </main>
    );
}
