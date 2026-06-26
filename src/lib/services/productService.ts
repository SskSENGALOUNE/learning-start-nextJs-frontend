import { apiFetch } from "@/lib/configs/httpClient";
import {
  CreateProductPayload,
  CreateProductResponse,
  Product,
} from "@/lib/types/product";

export const productService = {
  getAll(page = 1, limit = 10, name?: string) {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (name) query.set("name", name);
    return apiFetch<Product[]>(`/product?${query.toString()}`);
  },
  getById(id: number) {
    return apiFetch<Product>(`/product/${id}`);
  },

  create(payload: CreateProductPayload) {
    return apiFetch<CreateProductResponse>("/product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  searchByPrice(minPrice: number, maxPrice: number) {
    const query = new URLSearchParams({
      minPrice: String(minPrice),
      maxPrice: String(maxPrice)
    })
    return apiFetch<Product[]>(`/product/search?${query.toString()}`)
  },
  remove(id: number) {
    return apiFetch<void>(`/product/${id}`, {
      method: "DELETE",
    });
  },
};
