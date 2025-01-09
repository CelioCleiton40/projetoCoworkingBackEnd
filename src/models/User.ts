import { User } from "../types";

export class UserMD {
    constructor(
        private id: number | string,
        private name: string,
        private email: string,
        private password: string,
        private phone: string | undefined,
        private document_type: string | undefined,
        private document_number: string | undefined,
        private is_admin: boolean,
        private created_at: string,
        private updated_at: string
    ){}

    public toDBModel(): User {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password_hash: this.password,
            phone: this.phone,
            document_type: this.document_type,
            document_number: this.document_number,
            is_admin: this.is_admin,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }

    // Getters and Setters
    public getId(): number | string { return this.id; }
    public setId(value: number): void { this.id = value; }

    public getName(): string { return this.name; }
    public setName(value: string): void { this.name = value; }

    public getEmail(): string { return this.email; }
    public setEmail(value: string): void { this.email = value; }

    public getPassword(): string { return this.password; }
    public setPassword(value: string): void { this.password = value; }

    public getPhone(): string | undefined { return this.phone; }
    public setPhone(value: string | undefined): void { this.phone = value; }

    public getDocumentType(): string | undefined { return this.document_type; }
    public setDocumentType(value: string | undefined): void { this.document_type = value; }

    public getDocumentNumber(): string | undefined { return this.document_number; }
    public setDocumentNumber(value: string | undefined): void { this.document_number = value; }

    public getIsAdmin(): boolean { return this.is_admin; }
    public setIsAdmin(value: boolean): void { this.is_admin = value; }

    public getCreatedAt(): string { return this.created_at; }
    public setCreatedAt(value: string): void { this.created_at = value; }

    public getUpdatedAt(): string { return this.updated_at; }
    public setUpdatedAt(value: string): void { this.updated_at = value; }
}
