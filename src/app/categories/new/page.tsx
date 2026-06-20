"use client";

import { useCreateCategory } from "@/hooks/useCreateCategory";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewCategoryPage() {
    const router = useRouter()
    const { create, submitting, error } = useCreateCategory();
    const [name, setName] = useState("");
    const [successName, setSuccessName] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await create({ name });
        if (result) {
            setSuccessName(result.name);
            setName("");
        }
        if(result) router.push('/categories')
    };

    return (
        <main>
            <h1>Create Category</h1>
            <form onSubmit={handleSubmit}>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Category name"
                    required
                />
                <button type="submit" disabled={submitting}>
                    {submitting ? "Creating..." : "Create"}
                </button>
            </form>
            {error && <p>Error: {error}</p>}
            {successName && <p>สร้างสำเร็จ: {successName}</p>}
        </main>
    );
}
