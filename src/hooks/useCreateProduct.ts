"use client"

import { productService } from "@/lib/services/productService"
import { CreateProductPayload } from "@/lib/types/product"
import { useState } from "react"

export const useCreateProduct = () =>{
    const [submitting , setSubmitting] = useState(false)
    const [error , setError] = useState<string | null> (null)

    const create =  async (payload: CreateProductPayload)=>{
        setSubmitting(true);
        setError(null)
        try {
            const res= await productService.create(payload)
            return res.data
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create product")
            return null
        }
        finally{
            setSubmitting(false)
        }
    }
    return { create, submitting, error };
}