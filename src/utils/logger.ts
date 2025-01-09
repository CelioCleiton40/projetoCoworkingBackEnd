import winston from 'winston';
import fs from 'fs'; // Importa o módulo fs

// Cria o diretório de logs se ele não existir
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
};

const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'white',
    silly: 'rainbow',
};

winston.addColors(colors);

const formatDevelopment = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.errors({ stack: true }),
    winston.format.colorize({ all: true }), // Adiciona cores ao console
    winston.format.printf(({ timestamp, level, message, stack }) => {
        if (stack) {
            return `${timestamp} ${level}: ${message} - ${stack}`;
        }
        return `${timestamp} ${level}: ${message}`;
    })
);

const formatProduction = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`) // Sem stack trace
);

const transports = [
    new winston.transports.Console({ format: formatDevelopment }), // Usa formatação de desenvolvimento no console
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: formatProduction,
        handleExceptions: true,
        handleRejections: true
    }),
    new winston.transports.File({
        filename: 'logs/combined.log',
        format: formatProduction,
        handleExceptions: true,
        handleRejections: true
    }),
];

const logger = winston.createLogger({
    level: level(),
    levels,
    format: process.env.NODE_ENV === 'development' ? formatDevelopment : formatProduction, // Formatação condicional
    transports,
    exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log', format: formatProduction })
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: 'logs/rejections.log', format: formatProduction })
    ]
});

export const stream = {
    write: (message: string) => {
        logger.http(message.trim());
    },
};

export default logger;