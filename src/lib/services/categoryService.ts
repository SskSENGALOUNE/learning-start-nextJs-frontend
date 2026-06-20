import { apiFetch } from "../configs/httpClient";
import { Category, CreateCategoryPayload } from "../types/category";

export const categoryService = {
    getAll() {
        return apiFetch<Category[]>("/category");
    },
    create(payload: CreateCategoryPayload) {
        return apiFetch<Category>("/category", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    },
};