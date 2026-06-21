"use client";

import { useState } from "react";
import { useCreateCustomer } from "@/hooks/useCreateCustomer";
import { useRouter } from "next/navigation";

export default function NewCustomerPage() {
    const router = useRouter()
    const { create, submitting, error } = useCreateCustomer();
    const [form, setForm] = useState({ name: "", email: "" });
    const [successName, setSuccessName] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await create(form);
        if (result) {
            setSuccessName(result.name);
            setForm({ name: "", email: "" });
        }if (result) router.push('/customer')
        
    };

    return (
        <main>
            <h1>Create Customer</h1>
            <form onSubmit={handleSubmit}>
                <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Name"
                    required
                />
                <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email"
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
