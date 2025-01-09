import { UserDatabase } from "../config/UserDataBase";
import { User } from "../types/index";
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

    public async getAllUsers(input: GetAllUsersInputDTO) {
        const { q, token } = input;

        if (typeof token !== "string") {
            throw new BadRequestError("'Token' precisa ser informado!");
        }

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError("'Token' não é válido!");
        }

        if (!payload.is_admin) {
            throw new BadRequestError('Acesso negado!');
        }

        const usersDB = await this.userDatabase.getAllUsers();

        const users = usersDB.map((userDB) => {
            if (!userDB.id) {
                throw new Error("User ID is required");
            }
            if (!userDB.created_at) {
                throw new Error("Created at is required");
            }
            if (!userDB.updated_at) {
                throw new Error("Updated at is required");
            }
            const user = new UserMD(
                userDB.id,
                userDB.name,
                userDB.email,
                userDB.password_hash,
                userDB.phone,
                userDB.document_type,
                userDB.document_number,
                Boolean(userDB.is_admin ?? false),
                userDB.created_at,
                userDB.updated_at
            );

            return user.toDBModel();
        });

        return users;
    }

    public async getUserById(id: number): Promise<User> {
        const userDB = await this.userDatabase.getUserById(id);

        if (!userDB) {
            throw new NotFoundError("Usuário não encontrado.");
        }

        if (!userDB.id || !userDB.created_at || !userDB.updated_at) {
            throw new Error("Dados do usuário incompletos no banco de dados.");
        }

        const user = new UserMD(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password_hash,
            userDB.phone,
            userDB.document_type,
            userDB.document_number,
            Boolean(userDB.is_admin),
            userDB.created_at,
            userDB.updated_at
        );

        return user.toDBModel();
    }

    public async deleteUserById(id: number): Promise<void> {
        const userExists = await this.userDatabase.getUserById(id);
        if(!userExists){
            throw new NotFoundError("Usuário não encontrado")
        }
        try {
            await this.userDatabase.deleteUserById(id);
        } catch (error) {
            console.error("Erro ao deletar usuário no banco de dados:", error);
            throw new Error("Erro interno ao deletar o usuário.");
        }
    }

    public async updateUser(id: number, input: any): Promise<User> {
        const userDB = await this.userDatabase.getUserById(id);

        if (!userDB) {
            throw new NotFoundError("Usuário não encontrado.");
        }

        // Validar se pelo menos um campo para atualização foi fornecido
        if (Object.keys(input).length === 0) {
            throw new BadRequestError("Nenhum dado para atualização fornecido.");
        }

        // Atualizar os campos do usuário com base no input
        const updatedUserData: Partial<User> = {}; // Use Partial para tipos parciais

        if (input.name) {
            updatedUserData.name = input.name;
        }
        if (input.email) {
            updatedUserData.email = input.email;
        }
        if (input.password) {
            const passwordHash = await this.hashManager.hash(input.password);
            updatedUserData.password_hash = passwordHash;
        }
        if (input.phone) {
            updatedUserData.phone = input.phone;
        }
        if (input.document_type) {
            updatedUserData.document_type = input.document_type;
        }
        if (input.document_number) {
            updatedUserData.document_number = input.document_number;
        }

        updatedUserData.updated_at = new Date().toISOString();

        try {
            await this.userDatabase.updateUser(id, updatedUserData); // Chama o método de atualização no banco de dados

            const updatedUserDB = await this.userDatabase.getUserById(id);

            if (!updatedUserDB) {
                throw new NotFoundError("Usuário não encontrado após a atualização (erro interno).");
            }

            if (!updatedUserDB.id || !updatedUserDB.created_at || !updatedUserDB.updated_at) {
                throw new Error("Dados do usuário incompletos no banco de dados após a atualização.");
            }
            
            const updatedUser = new UserMD(
                updatedUserDB.id,
                updatedUserDB.name,
                updatedUserDB.email,
                updatedUserDB.password_hash,
                updatedUserDB.phone,
                updatedUserDB.document_type,
                updatedUserDB.document_number,
                Boolean(updatedUserDB.is_admin),
                updatedUserDB.created_at,
                updatedUserDB.updated_at
            );
            return updatedUser.toDBModel()

        } catch (dbError) {
            console.error("Erro ao atualizar usuário no banco de dados:", dbError);
            throw new Error("Erro interno ao atualizar o usuário."); // Lança um erro genérico para não expor detalhes do banco
        }
    }

    public async signUp(input: SignUpDTO) {
        const { name, email, password, phone, document_type, document_number, is_admin } = input;

        if (typeof name !== "string") {
            throw new BadRequestError("'Name' precisa ser uma string.");
        }

        if (typeof email !== "string") {
            throw new BadRequestError("'E-mail' precisa ser uma string.");
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'Password' precisa ser uma string.");
        }

        const id = this.idGenerator.generate();
        const passwordHash = await this.hashManager.hash(password);
        const created_at = new Date().toISOString();
        const updated_at = created_at;

        const filterUserbyEmail = await this.userDatabase.getUserByEmail(email);

        if (filterUserbyEmail) {
            throw new BadRequestError("'E-mail' já cadastrado!");
        }

        const newUser = new UserMD(
            id,
            name,
            email,
            passwordHash,
            phone,
            document_type,
            document_number,
            Boolean(is_admin ?? false),  // Padrão para false se não fornecido
            created_at,
            updated_at
        );

        const tokenPayload: TokenPayload = {
            id: String(newUser.getId()),
            name: newUser.getName(),
            is_admin: newUser.getIsAdmin()
        };

        const token = this.tokenManager.createToken(tokenPayload);
        const newUserDB = newUser.toDBModel();
        await this.userDatabase.signUp(newUserDB);

        const output = {
            message: "Usuário cadastrado com sucesso",
            token
        };

        return output;
    }

    public async login(input: LoginDTO) {
        const { email, password } = input;

        if (typeof email !== "string") {
            throw new BadRequestError("'E-mail' precisa ser uma string.");
        }

        if (password === undefined) {
            throw new BadRequestError("Inserir 'password'");
        }

        const searchUserByLogin = await this.userDatabase.getUserByEmail(email);

        if (!searchUserByLogin) {
            throw new NotFoundError("'E-mail' não cadastrado!");
        }

        const passwordHash = await this.hashManager.compare(password, searchUserByLogin.password_hash);

        if (!passwordHash) {
            throw new BadRequestError("'E-mail' ou 'senha' inválidos");
        }

        if (!searchUserByLogin.id) {
            throw new BadRequestError("User ID is required");
        }

        if (!searchUserByLogin.created_at) {
            throw new BadRequestError("Created at is required");
        }

        const userLogin = new UserMD(
            searchUserByLogin.id,
            searchUserByLogin.name,
            searchUserByLogin.email,
            searchUserByLogin.password_hash,
            searchUserByLogin.phone,
            searchUserByLogin.document_type,
            searchUserByLogin.document_number,
            Boolean(searchUserByLogin.is_admin ?? false),
            searchUserByLogin.created_at,
            searchUserByLogin.updated_at ?? searchUserByLogin.created_at
        );

        const tokenPayload: TokenPayload = {
            id: String(userLogin.getId()),
            name: userLogin.getName(),
            is_admin: userLogin.getIsAdmin()
        };

        const token = this.tokenManager.createToken(tokenPayload);

        const output = { message: "Login realizado com sucesso", token };
        return output;
    }
}
