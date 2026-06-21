"use client";

import { useCallback, useEffect, useState } from "react";
import { bankAccountService } from "@/lib/services/bankAccountService";
import { BankAccount } from "@/lib/types/bankAccount";

interface ComparisonResult {
    data: BankAccount[];
    ms: number;
}

export const useOffsetVsCursor = (limit = 20) => {
    const [offsetResult, setOffsetResult] = useState<ComparisonResult | null>(null);
    const [cursorResult, setCursorResult] = useState<ComparisonResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const run = useCallback(async (page: number, cursorId?: number) => {
        setLoading(true);
        setError(null);
        try {
            const [offsetRes, cursorRes] = await Promise.all([
                bankAccountService.getOffset(page, limit),
                bankAccountService.getCursor(cursorId, limit),
            ]);
            setOffsetResult(offsetRes.data);
            setCursorResult(cursorRes.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch");
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount
        run(1);
    }, [run]);

    return { offsetResult, cursorResult, loading, error, run };
};
