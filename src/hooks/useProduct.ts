"use client"

import { productService } from "@/lib/services/productService";
import { Product } from "@/lib/types/product"
import { useCallback, useEffect, useState } from "react"

export const useProduct = (id:number) =>{
    const [data, setData] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error , setError] = useState<string | null>(null)

    const fetchProduct = useCallback( async ()=>{
        setLoading(true);
        setError(null) 
        try {
            const res = await productService.getById(id)
            setData(res.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch product");
        }
        finally {
            setLoading(false);
        }
    },[id]);

    useEffect(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount, mirrors mastermind's hook convention
        fetchProduct();
    },[fetchProduct])
       return { data, loading, error, refresh: fetchProduct };
}