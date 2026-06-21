export interface BankAccount {
    id: number;
    userId: number;
    accountNumber: string;
    bankName: string;
    balance: number;
    accountType: string;
    interestRate: number;
    currency: string;
    isActive: boolean;
    lastTransactionAt: string | null;
    createdAt: string;
}
export interface TimedResult<T> {
    data: T;
    ms: number;
}
export interface BenchmarkResult {
    pagination: { offset_page4000: number; cursor_start: number };
    filter: { select_star: number; select_fields: number };
    aggregation: { prisma_orm: number; raw_sql: number };
}

export type AccountType = "SAVINGS" | "CHECKING" | "FIXED_DEPOSIT";

export interface CompositeFilterResult {
    composite_index: { count: number; ms: number };
    no_composite_index: { count: number; ms: number };
    note: string;
}
