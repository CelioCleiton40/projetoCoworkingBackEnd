export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational: boolean = true) {
        super(message);

        Object.setPrototypeOf(this, AppError.prototype); // Necessário para herança funcionar corretamente

        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor); // Captura o stack trace
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Não autorizado') {
        super(message, 401, true);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Acesso proibido') {
        super(message, 403, true);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string = 'Requisição inválida') {
        super(message, 400, true);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

// Outros erros customizados, se necessário...