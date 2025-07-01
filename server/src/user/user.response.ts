export interface UserResponse {
    success:boolean;
    statusCode: number;
    message: string;
    data: {
        id?: string;
        name?: string;
        email?: string;
        username?: string;
    } | null;
    }