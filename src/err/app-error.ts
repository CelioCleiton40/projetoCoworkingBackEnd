export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype); // Necessário para herança correta em ES5

        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor); // Captura o stack trace
    }
}

// Erros mais específicos (herdando de AppError)
export class BadRequestError extends AppError {
    constructor(message: string) {
        super(message, 400); // 400 Bad Request
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message, 401); // 401 Unauthorized
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(message, 403); // 403 Forbidden
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404); // 404 Not Found
    }
}

export class InternalServerError extends AppError {
    constructor(message: string) {
        super(message, 500); // 500 Internal Server Error
    }
}

export class ErrorHandler extends AppError {
    constructor(message: string) {
        super(message, 500); // 500 Internal Server Error
    }
}