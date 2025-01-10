import { UserService } from "../services/UserService";
import { Request, Response } from "express";
import { UserDTO } from "../dtos/userDTO";
import logger from "../utils/logger"; // Certifique-se de importar seu logger corretamente

export class UserController {
    constructor(
        private userBusiness: UserService,
        private userDTO: UserDTO,
    ) {}

    public getAllUsers = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            if (!token) {
                return res.status(400).send({ error: "Token não fornecido." });
            }

            const input = this.userDTO.getAllUsersInput(req.query.q as string, token);
            const output = await this.userBusiness.getAllUsers(input);

            res.status(200).send(output);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            logger.error(`Erro ao obter todos os usuários: ${errorMessage}`);
            res.status(500).send({ error: errorMessage || "Erro inesperado ao obter usuários" });
        }
    }

    public signUp = async (req: Request, res: Response) => {
        try {
            const { name, email, password, phone, document_type, document_number, is_admin } = req.body;

            // Validação de campos obrigatórios
            if (!name || !email || !password) {
                return res.status(400).send({ error: "Nome, email e senha são obrigatórios." });
            }

            // Validação do formato do e-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).send({ error: "Formato de e-mail inválido." });
            }

            // Validação da senha (mínimo de 8 caracteres)
            if (password.length < 8) {
                return res.status(400).send({ error: "A senha deve ter pelo menos 8 caracteres." });
            }

            logger.info(`Tentando cadastrar usuário: ${JSON.stringify(req.body)}`);

            // Criando DTO para signUp
            const input = this.userDTO.signUp(name, email, password, phone, document_type, document_number, is_admin);

            // Chamada ao serviço de negócios para cadastro de usuário
            const output = await this.userBusiness.signUp(input);

            // Envia a resposta de sucesso
            res.status(201).send(output);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            logger.error(`Erro ao cadastrar usuário: ${errorMessage}`);
            res.status(500).send({ error: errorMessage || "Erro inesperado ao cadastrar usuário" });
        }
    }

    public login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            // Validação de campos obrigatórios para login
            if (!email || !password) {
                return res.status(400).send({ error: "Email e senha são obrigatórios." });
            }

            // Validação do formato do e-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).send({ error: "Formato de e-mail inválido." });
            }

            // Criando DTO para login
            const input = this.userDTO.login(email, password);

            // Chamada ao serviço de login
            const output = await this.userBusiness.login(input);

            // Envia a resposta de sucesso
            res.status(200).send(output);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            logger.error(`Erro ao realizar login: ${errorMessage}`);
            res.status(500).send({ error: errorMessage || "Erro inesperado ao realizar login" });
        }
    }
}
