"use client"
import { productService } from "@/lib/services/productService";
import { Product } from "@/lib/types/product";
import { useState } from "react";

export const useProductSearch = () => {
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);  // เริ่ม false! ยังไม่โหลดจนกว่าจะกด
    const [searched, setSearched] = useState(false); // เคยกดค้นหารึยัง → ใช้แยก empty state

    const search = async (minPrice: number, maxPrice: number) => {
        setLoading(true)
        try {
            const res = await productService.searchByPrice(minPrice, maxPrice);
            setData(res.data)
            setSearched(true)
        } catch (err) {
            console.error("Product search error:", err)
        } finally {
            setLoading(false)
        }
    }
    return { data, loading, searched, search };


}