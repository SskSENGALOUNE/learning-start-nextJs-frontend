"use client";

import { useCallback, useEffect, useState } from "react";
import { Category } from "@/lib/types/category";
import { categoryService } from "@/lib/services/categoryService";
import { useDebounce } from "./useDebounce";

export const useCategories = (keyword: string="") => {
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const debouncedKeyword = useDebounce(keyword, 400);
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = debouncedKeyword
                ? await categoryService.search(debouncedKeyword)
                : await categoryService.getAll();
            setData(res.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    }, [debouncedKeyword]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount
        fetchCategories();
    }, [fetchCategories]);

    return { data, loading, error, refresh: fetchCategories };
};
