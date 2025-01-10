export interface GetAllUsersInputDTO {
    q: string;
    token: string;
}

export interface SignUpDTO {
    name: string;
    email: string;
    password: string;
    phone?: string;
    document_type?: string;
    document_number?: string;
    is_admin?: boolean;  // Usando boolean ao invés de number
}

export interface LoginDTO {
    email: string;
    password: string;
}

export class UserDTO {
    // Função para obter todos os usuários
    getAllUsersInput(q: string, token: string): GetAllUsersInputDTO {
        // Verificação simples para token
        if (!this.isValidToken(token)) {
            throw new Error('Invalid token');
        }
        return { q, token };
    }

    // Função para cadastrar um novo usuário
    signUp(name: string, email: string, password: string, phone?: string, document_type?: string, document_number?: string, is_admin?: boolean): SignUpDTO {
        // Validação básica para garantir que email e senha estão presentes
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        // Validação do formato do e-mail
        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email format');
        }

        return { name, email, password, phone, document_type, document_number, is_admin };
    }

    // Função para realizar login
    login(email: string, password: string): LoginDTO {
        // Validação básica para garantir que email e senha estão presentes
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        return { email, password };
    }

    // Função simples de validação de formato de e-mail
    private isValidEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Função simples para validar token (exemplo)
    private isValidToken(token: string): boolean {
        // Aqui você pode implementar a validação real do seu token
        return token.length > 10; // Exemplo simples
    }
}
