"use client"

import { productService } from "@/lib/services/productService"
import { UpdateProductPayload } from "@/lib/types/product"
import { useState } from "react"


export const useUpdateProduct = () => {
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const update = async (id: number, payload: UpdateProductPayload) => {
        setSubmitting(true)
        try {
            const res = await productService.update(id, payload)
            return res.data
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to Update product")
            return null
        }
        finally {
            setSubmitting(false)
        }
    }
    return { update, submitting, error };
}