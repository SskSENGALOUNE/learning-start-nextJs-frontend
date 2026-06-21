export interface Customer {
    id: number;
    email: string;
    name: string;
}

export interface CreateCustomerPayload {
    name: string;
    email: string;
}
