export type TJWTToken = {
    access: string;
    refresh: string;
};

export type TJWTTokenPayload = {
    userId: number;
    username: string;
};
