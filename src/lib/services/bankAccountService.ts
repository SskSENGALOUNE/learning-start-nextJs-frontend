import { apiFetch } from "../configs/httpClient";
import { AccountType, BankAccount, BenchmarkResult, CompositeFilterResult, TimedResult } from "../types/bankAccount";

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
getComposite(accountType: AccountType, isActive: boolean, limit: number) {
    const query = new URLSearchParams({
        accountType,
        isActive: String(isActive),
        limit: String(limit),
    });
    return apiFetch<CompositeFilterResult>(`/bank-accounts/composite?${query.toString()}`);
},

};