import { apiFetch } from "@/lib/configs/httpClient";
import { Product } from "@/lib/types/product";

export const productService = {
    getAll(page = 1, limit = 10, name?: string) {
        const query = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (name) query.set("name", name);
        return apiFetch<Product[]>(`/product?${query.toString()}`);
    },
};

