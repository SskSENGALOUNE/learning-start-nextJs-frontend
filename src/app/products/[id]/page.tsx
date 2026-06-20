"use client"

import { useProduct } from "@/hooks/useProduct"
import { useParams } from "next/navigation"


export default function ProductDetailPage(){
    const params = useParams<{id: string}>()
    const {data, loading, error} = useProduct(Number(params.id))

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data) return <p>Not found</p>;


    return (
        <main>
            <h1>{data.name}</h1>
            <p>Price: K{data.price}</p>
            <p>Stock: {data.stock}</p>
        </main>
    )
}