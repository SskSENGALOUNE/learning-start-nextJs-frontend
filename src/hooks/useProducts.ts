"use client";

import { useCallback, useEffect, useState } from "react";
import { PaginationMeta } from "@/lib/types/pagination";
import { Product } from "@/lib/types/product";
import { productService } from "@/lib/services/productService";

export const useProducts = (initialLimit = 10) => {
  const [data, setData] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const [params, setParams] = useState({
    page: 1,
    limit: initialLimit,
    name: "",
    minPrice: "", // เก็บเป็น string (มาจาก input) "" = ไม่ filter
    maxPrice: "",
    sortOrder: "",
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const hasPriceFilter = params.minPrice !== "" && params.maxPrice !== "";

      const res = hasPriceFilter
        ? await productService.searchByPrice(
            Number(params.minPrice),
            Number(params.maxPrice),
          )
        : params.sortOrder
          ? await productService.sortByPrice(params.sortOrder as "asc" | "desc")
          : await productService.getAll(params.page, params.limit, params.name);

      setData(res.data);
      setMeta(res.meta ?? null); // search ไม่มี meta → null → pagination disable เอง
    } catch (err) {
      console.error("Product Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount, mirrors mastermind's hook convention
    fetchProducts();
  }, [fetchProducts]);

  const updateParams = (newParams: Partial<typeof params>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
      page: newParams.page ?? 1,
    }));
  };

  return {
    data,
    meta,
    loading,
    params,
    updateParams,
    refresh: fetchProducts,
  };
};
