"use client"

import { useProduct } from '@/hooks/useProduct';
import { useUpdateProduct } from '@/hooks/useUpdateProduct';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
    const params = useParams<{ id: string }>();
    const id = Number(params.id);                  // string จาก URL → number (เรื่องเดิมที่เราคุยกัน!)
    const { data, loading, error } = useProduct(id);      // ✅ reuse hook เดิม pre-fill
    const { update, submitting } = useUpdateProduct();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    const router = useRouter();   // import { useRouter } from "next/navigation"

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const ok = await update(id, { name, price: Number(price) });
        //                       ▲          ▲
        //              argument 1: id   argument 2: payload object
        if (ok) router.push(`/products/${id}`);   // กลับไปหน้า detail
    };


    useEffect(() => {
        if (data) { setName(data.name); setPrice(String(data.price)); }  // ก๊อปค่าเดิมลงฟอร์ม "ตอน data มาถึง"
    }, [data]);

    if (loading) return <p>กำลังโหลด...</p>;   // วางก่อน return ฟอร์ม
    if (error) {
        return <p>เกิดข้อผิดพลาด: {error}</p>
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                {/* ใช้ label เพื่อให้รองรับ Screen Reader และกดที่ข้อความแล้วโฟกัสที่ช่องกรอกได้ */}
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="name" style={{ display: 'block' }}>Name:</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required // เพิ่มเพื่อให้แน่ใจว่าต้องกรอกข้อมูล
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="price" style={{ display: 'block' }}>Price:</label>
                    <input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min="0" // ป้องกันค่าติดลบ
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    style={{ cursor: submitting ? 'not-allowed' : 'pointer' }}
                >
                    {submitting ? "กำลังบันทึก..." : "Save"}
                </button>
            </form>
        </div>

    )
}

export default page