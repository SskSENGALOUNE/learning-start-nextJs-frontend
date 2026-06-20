import { categoryService } from "@/lib/services/categoryService";
import { CreateCategoryPayload } from "@/lib/types/category";
import { useState } from "react";

export const useCreateCategory = () => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const create = async (payload: CreateCategoryPayload) => {
        setSubmitting(true);
        setError(null);
        try {
            const res = await categoryService.create(payload);
            return res.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create category");
            return null;
        } finally {
            setSubmitting(false);
        }
    };
    return { create, submitting, error };
};

