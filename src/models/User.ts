import { User } from "../types";
import bcrypt from 'bcryptjs';

export class UserMD {
    constructor(
        private id: number,
        private name: string,
        private email: string,
        private password_hash: string,  // Agora estamos armazenando o password_hash, não mais o password diretamente
        private phone: string | null = null,  // Usando null para valores ausentes
        private document_type: string | null = null,
        private document_number: string | null = null,
        private is_admin: boolean,
        private created_at: Date,
        private updated_at: Date
    ) {}

    // Convertendo para o modelo de DB
    public async toDBModel(): Promise<User> {
        // Garantindo que a senha esteja criptografada
        const password_hash = await bcrypt.hash(this.password_hash, 10);  // Assíncrono

        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password_hash: password_hash,  // Usando password_hash em vez de password
            phone: this.phone ?? undefined,
            document_type: this.document_type ?? undefined,
            document_number: this.document_number ?? undefined,
            is_admin: this.is_admin,
            created_at: this.created_at.toISOString(),  // Garantindo que a data seja no formato ISO
            updated_at: this.updated_at.toISOString()   // Garantindo que a data seja no formato ISO
        };
    }

    // Getters e Setters com validações

    public getId(): number { return this.id; }
    public setId(value: number): void { this.id = value; }

    public getName(): string { return this.name; }
    public setName(value: string): void { this.name = value; }

    public getEmail(): string { return this.email; }
    public setEmail(value: string): void {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(value)) {
            throw new Error("Email inválido.");
        }
        this.email = value;
    }

    public getPasswordHash(): string { return this.password_hash; }
    public async setPassword(value: string): Promise<void> {
        // Criptografa a senha antes de salvar
        this.password_hash = await bcrypt.hash(value, 10);
    }

    public getPhone(): string | null { return this.phone; }
    public setPhone(value: string | null): void { this.phone = value; }

    public getDocumentType(): string | null { return this.document_type; }
    public setDocumentType(value: string | null): void { this.document_type = value; }

    public getDocumentNumber(): string | null { return this.document_number; }
    public setDocumentNumber(value: string | null): void { this.document_number = value; }

    public getIsAdmin(): boolean { return this.is_admin; }
    public setIsAdmin(value: boolean): void { this.is_admin = value; }

    public getCreatedAt(): Date { return this.created_at; }
    public setCreatedAt(value: Date): void { this.created_at = value; }

    public getUpdatedAt(): Date { return this.updated_at; }
    public setUpdatedAt(value: Date): void { this.updated_at = value; }

    // Método para comparar a senha com o hash armazenado no banco de dados
    public async checkPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password_hash);
    }
}
