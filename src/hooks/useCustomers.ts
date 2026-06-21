"use client";

import { useCallback, useEffect, useState } from "react";
import { Customer } from "@/lib/types/customer";
import { customerService } from "@/lib/services/customerService";

export const useCustomers = () => {
    const [data, setData] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await customerService.getAll();
            setData(res.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch customers");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount
        fetchCustomers();
    }, [fetchCustomers]);

    return { data, loading, error, refresh: fetchCustomers };
};
