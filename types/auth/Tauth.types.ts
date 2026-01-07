export type TUser = {
    id: string,
    createdAt?: Date,
    email: string,
    emailVerified?: boolean,
    image?: string | undefined | null,
    name: string,
    updatedAt?: Date
}