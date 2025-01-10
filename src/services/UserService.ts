import { UserDatabase } from "../config/UserDataBase";
import { User } from "../types";
import { TokenPayload } from "../types";
import { SignUpDTO, LoginDTO, GetAllUsersInputDTO } from "../dtos/userDTO";
import { HashManager } from "../middlewares/hashmanager";
import { BadRequestError } from "../err/BadRequestError";
import { NotFoundError } from "../err/NotFoundError";
import { IdGenerator } from "../middlewares/IdGenerator";
import { TokenManager } from "../middlewares/TokenManager";
import { UserMD } from "../models/User";

export class UserService {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) {}

    private validateToken(token: string): TokenPayload {
        if (typeof token !== "string") {
            throw new BadRequestError("'Token' precisa ser informado!");
        }

        const payload = this.tokenManager.getPayload(token);

        if (!payload) {
            throw new BadRequestError("'Token' não é válido!");
        }

        return payload;
    }

    public async getAllUsers(input: GetAllUsersInputDTO) {
        const { q, token } = input;
        const payload = this.validateToken(token);

        if (!payload.is_admin) {
            throw new BadRequestError('Acesso negado!');
        }

        const usersDB = await this.userDatabase.getAllUsers();

        return usersDB.map((userDB) => {
            if (!userDB.id || !userDB.created_at || !userDB.updated_at) {
                throw new Error("Dados incompletos do usuário no banco.");
            }

            const user = new UserMD(
                Number(userDB.id),
                userDB.name,
                userDB.email,
                userDB.password_hash,
                userDB.phone,
                userDB.document_type,
                userDB.document_number,
                Boolean(userDB.is_admin ?? false),
                new Date(userDB.created_at),
                new Date(userDB.updated_at)
            );

            return user.toDBModel();
        });
    }

    public async getUserById(id: number): Promise<User> {
        const userDB = await this.userDatabase.getUserById(id);

        if (!userDB) {
            throw new NotFoundError("Usuário não encontrado.");
        }

        if (!userDB.id || !userDB.created_at || !userDB.updated_at) {
            throw new Error("Dados incompletos do usuário no banco.");
        }

        const user = new UserMD(
            Number(userDB.id),
            userDB.name,
            userDB.email,
            userDB.password_hash,
            userDB.phone,
            userDB.document_type,
            userDB.document_number,
            Boolean(userDB.is_admin),
            new Date (userDB.created_at),
            new Date (userDB.updated_at)
        );

        return user.toDBModel();
    }

    public async deleteUserById(id: number): Promise<void> {
        const userExists = await this.userDatabase.getUserById(id);
        if (!userExists) {
            throw new NotFoundError("Usuário não encontrado.");
        }

        try {
            await this.userDatabase.deleteUserById(id);
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
            throw new Error("Erro interno ao deletar o usuário.");
        }
    }

    public async updateUser(id: number, input: Partial<User>): Promise<User> {
        const userDB = await this.userDatabase.getUserById(id);

        if (!userDB) {
            throw new NotFoundError("Usuário não encontrado.");
        }

        if (Object.keys(input).length === 0) {
            throw new BadRequestError("Nenhum dado para atualização fornecido.");
        }

        const updatedUserData: Partial<User> = { ...input, updated_at: new Date().toISOString() };

        if (input.password_hash) {
            updatedUserData.password_hash = await this.hashManager.hash(input.password_hash);
        }

        try {
            await this.userDatabase.updateUser(id, updatedUserData);
            const updatedUserDB = await this.userDatabase.getUserById(id);

            if (!updatedUserDB) {
                throw new NotFoundError("Usuário não encontrado após atualização.");
            }

            const updatedUser = new UserMD(
                Number(updatedUserDB.id),
                updatedUserDB.name,
                updatedUserDB.email,
                updatedUserDB.password_hash,
                updatedUserDB.phone,
                updatedUserDB.document_type,
                updatedUserDB.document_number,
                Boolean(updatedUserDB.is_admin),
                new Date(updatedUserDB.created_at ?? new Date()),
                new Date(updatedUserDB.updated_at ?? new Date())
            );

            return updatedUser.toDBModel();
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            throw new Error("Erro interno ao atualizar o usuário.");
        }
    }

    public async signUp(input: SignUpDTO) {
        const { name, email, password, phone, document_type, document_number, is_admin } = input;

        if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
            throw new BadRequestError("'Name', 'E-mail' e 'Password' precisam ser strings.");
        }

        const id = this.idGenerator.generate();
        const passwordHash = await this.hashManager.hash(password);
        const created_at = new Date().toISOString();
        const updated_at = created_at;

        const userExists = await this.userDatabase.getUserByEmail(email);
        if (userExists) {
            throw new BadRequestError("'E-mail' já cadastrado!");
        }

        const newUser = new UserMD(
            Number(id),
            name,
            email,
            passwordHash,
            phone,
            document_type,
            document_number,
            Boolean(is_admin ?? false),
            new Date(created_at),
            new Date(updated_at)
        );

        const tokenPayload: TokenPayload = {
            id: String(newUser.getId()),
            name: newUser.getName(),
            is_admin: newUser.getIsAdmin(),
        };

        const token = this.tokenManager.createToken(tokenPayload);
        const newUserDB = await newUser.toDBModel();
        await this.userDatabase.signUp(newUserDB);

        return { message: "Usuário cadastrado com sucesso", token };
    }

    public async login(input: LoginDTO) {
        const { email, password } = input;

        if (typeof email !== "string" || !password) {
            throw new BadRequestError("'E-mail' precisa ser uma string e 'Password' deve ser informado.");
        }

        const userDB = await this.userDatabase.getUserByEmail(email);

        if (!userDB) {
            throw new NotFoundError("E-mail não cadastrado.");
        }

        const passwordMatch = await this.hashManager.compare(password, userDB.password_hash);

        if (!passwordMatch) {
            throw new BadRequestError("'E-mail' ou 'senha' inválidos.");
        }

        const userLogin = new UserMD(
            Number(userDB.id),
            userDB.name,
            userDB.email,
            userDB.password_hash,
            userDB.phone,
            userDB.document_type,
            userDB.document_number,
            Boolean(userDB.is_admin),
            new Date(userDB.created_at ?? new Date()),
            new Date(userDB.updated_at ?? userDB.created_at ?? new Date())
        );

        const tokenPayload: TokenPayload = {
            id: String(userLogin.getId()),
            name: userLogin.getName(),
            is_admin: userLogin.getIsAdmin(),
        };

        const token = this.tokenManager.createToken(tokenPayload);

        return { message: "Login realizado com sucesso", token };
    }
}
