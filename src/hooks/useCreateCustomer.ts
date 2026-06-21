"use client";

import { useState } from "react";
import { customerService } from "@/lib/services/customerService";
import { CreateCustomerPayload } from "@/lib/types/customer";

export const useCreateCustomer = () => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (payload: CreateCustomerPayload) => {
        setSubmitting(true);
        setError(null);
        try {
            const res = await customerService.create(payload);
            return res.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create customer");
            return null;
        } finally {
            setSubmitting(false);
        }
    };

    return { create, submitting, error };
};
