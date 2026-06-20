import { PaginationMeta } from "@/lib/types/pagination";

export interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: PaginationMeta;
}

export async function apiFetch<T>(
    path: string,
    options?: RequestInit,
): Promise<ApiEnvelope<T>> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, options);
    const json: ApiEnvelope<T> = await res.json();

    if (!res.ok || !json.success) {
        throw new Error(json.message ?? "Request failed");
    }

    return json;
}
