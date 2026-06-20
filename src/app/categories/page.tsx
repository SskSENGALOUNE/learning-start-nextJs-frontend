"use client";


import { useCategories } from "@/hooks/useCategories";
import Link from "next/link";

export default function CategoriesPage() {
    const { data, loading, error } = useCategories();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <main>
            <h1>Categories</h1>
            <Link href="/categories/new">+ Create Category</Link>
            <ul>
                {data.map((c) => (
                    <li key={c.id}>{c.name}</li>
                ))}
            </ul>
        </main>
    );
}
