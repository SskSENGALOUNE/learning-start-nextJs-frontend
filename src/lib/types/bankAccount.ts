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