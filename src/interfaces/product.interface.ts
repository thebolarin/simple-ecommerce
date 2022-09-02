import { ObjectId } from 'mongoose';

export interface ProductPayload {
    name: string,
    price: number,
    image: string,
    minimumQuantity: number,
    discountRate: number,
    category: ObjectId
}

export interface ProductUploadPayload {
    fileName: string,
    fileType: string
}

export interface ProductQueryPayload {
    name: string,
    price: number,
    image: string,
    code: string,
    page: number,
    limit: number,
    category: string
}
