export interface GetAllUsersInputDTO {
    q: string,
    token: string,
}

export interface SignUpDTO {
    name: string,
    email: string,
    password: string,
    phone?: string,
    document_type?: string,
    document_number?: string,
    is_admin?: number
}

export interface LoginDTO {
    email: string,
    password: string,
}

export class UserDTO {
    getAllUsersInput = (q: string, token: string): GetAllUsersInputDTO => {
        const result: GetAllUsersInputDTO = { q, token }
        return result
    }

    signUp = (name: string, email: string, password: string, phone?: string, document_type?: string, document_number?: string, is_admin?: number): SignUpDTO => {
        const result: SignUpDTO = { name, email, password, phone, document_type, document_number, is_admin }
        return result
    }

    login = (email: string, password: string): LoginDTO => {
        const result: LoginDTO = { email, password }
        return result
    }
}
