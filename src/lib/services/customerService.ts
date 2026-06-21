import { apiFetch } from "../configs/httpClient"
import { CreateCustomerPayload, Customer } from "../types/customer"

export const customerService = {
    create(payload: CreateCustomerPayload
    ){
        return apiFetch<Customer>("/customer",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(payload),
        })
    },
    getAll() {
        return apiFetch<Customer[]>("/customer");
    }

}