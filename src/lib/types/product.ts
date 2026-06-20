export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
}

export interface CreateProductPayload{
    name: string
    price: number
    stock: number
}

export interface CreateProductResponse{
    id: number
    name: string
    price: number
}