"use client";
import { useProductSearch } from "@/hooks/useProductSearch";
import { useState } from "react";

export default function ProductSearchPage() {
    const { data, loading, searched, search } = useProductSearch()
    const [min, setMin] = useState("")
    const [max, setMax] = useState("")
    const [error, setError] = useState("")

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const minN = Number(min), maxN = Number(max)

        if (min === '' || max === '') {
            return setError("กรอกราคาให้ครบทั้งสองช่อง");
        }
        if (minN > maxN) return setError("ราคาต่ำสุดต้องไม่เกินราคาสูงสุด");
        setError("")
        search(minN, maxN)
    }
    return (
        <main>
            <form onSubmit={onSubmit}>
                <input type="number" value={min} onChange={(e) => setMin(e.target.value)} />
                <input type="number" value={max} onChange={(e) => setMax(e.target.value)} />
                <button disabled={loading}>{loading ? "กำลังค้นหา..." : "ค้นหา"}</button>
            </form>
            {error && <p className="text-red-600">{error}</p>}

            {!searched ? (
                <p>กรอกช่วงราคาแล้วกดค้นหา</p>
            ) : data.length === 0 ? (
                <p>ไม่พบสินค้าในช่วงราคานี้</p>      // ← empty state จริง
            ) : (
                <ul>{data.map((p) => <li key={p.id}>{p.name} — ฿{p.price.toLocaleString()}</li>)}</ul>
            )}
        </main>
    );







}