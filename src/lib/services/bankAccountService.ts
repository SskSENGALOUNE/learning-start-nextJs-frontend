import { apiFetch } from "../configs/httpClient";
import { BankAccount, BenchmarkResult, TimedResult } from "../types/bankAccount";

export const bankAccountService = {
    getOffset(page: number, limit: number) {
        return apiFetch<TimedResult<BankAccount[]>>(`/bank-accounts/offset?page=${page}&limit=${limit}`);
    },
    getCursor(cursorId: number | undefined, limit: number) {
        const query = new URLSearchParams({ limit: String(limit) });
        if (cursorId) query.set("cursorId", String(cursorId));
        return apiFetch<TimedResult<BankAccount[]>>(`/bank-accounts/cursor?${query.toString()}`);
    },
    getBenchmark() {
    return apiFetch<BenchmarkResult>("/bank-accounts/benchmark");
},

};