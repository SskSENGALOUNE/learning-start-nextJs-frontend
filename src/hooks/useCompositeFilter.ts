"use client";

import { useCallback, useEffect, useState } from "react";
import { bankAccountService } from "@/lib/services/bankAccountService";
import { AccountType, CompositeFilterResult } from "@/lib/types/bankAccount";

export const useCompositeFilter = () => {
    const [data, setData] = useState<CompositeFilterResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const run = useCallback(async (accountType: AccountType, isActive: boolean, limit: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await bankAccountService.getComposite(accountType, isActive, limit);
            setData(res.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount with defaults
        run("SAVINGS", true, 50);
    }, [run]);

    return { data, loading, error, run };
};
