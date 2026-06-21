"use client";

import { useCallback, useEffect, useState } from "react";
import { bankAccountService } from "@/lib/services/bankAccountService";
import { BenchmarkResult } from "@/lib/types/bankAccount";

export const useBenchmark = () => {
    const [data, setData] = useState<BenchmarkResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBenchmark = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await bankAccountService.getBenchmark();
            setData(res.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch benchmark");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount
        fetchBenchmark();
    }, [fetchBenchmark]);

    return { data, loading, error, refresh: fetchBenchmark };
};
