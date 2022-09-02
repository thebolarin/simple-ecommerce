export interface CategoryPayload {
    name: string;
}

export interface CategoryQueryPayload {
    name:string,
    code: string,
    limit: number,
    page: number
}