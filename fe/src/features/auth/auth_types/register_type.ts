export interface RegisterFormValues {
    user_name: string;
    name?: string;
    email: string;
    password: string;
    confirmPassword: string;
    date_of_birth?: string;
    gender?: string;
}

export interface RegisterResponse {
    status: string;
    code: number;
    message: string;
    metadata: {
        id: string;
        user_name: string;
        email: string;
        name?: string;
        gender?: string;
        date_of_birth?: string;
        is_active: string;
        createdAt: string;
    };
}
