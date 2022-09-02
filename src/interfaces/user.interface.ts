export interface UserPayload {
    _id?: string;
    userName: string,
    email: string,
    password: string,
    lastLoginTime?: Date,
}

export interface UserQueryPayload {
    userName: string,
    email: string,
    page: number,
    limit: number
}