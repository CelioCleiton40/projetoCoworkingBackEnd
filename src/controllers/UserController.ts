import { UserService } from "../services/UserService";
import { Request, Response } from "express";
import { UserDTO } from "../dtos/userDTO";

export class UserController {
    constructor(
        private userBusiness: UserService,
        private userDTO: UserDTO,
    ) {}

    public getAllUsers = async (req: Request, res: Response) => {
        try {
            const input = this.userDTO.getAllUsersInput(
                req.query.q as string,
                req.headers.authorization as string
            );

            const output = await this.userBusiness.getAllUsers(input);

            res.status(200).send(output);

        } catch (error) {
            console.log(error);

            if (req.statusCode === 200) {
                res.status(500);
            }

            if (error instanceof Error) {
                res.send(error.message);
            } else {
                res.send("Erro inesperado");
            }
        }
    }

    public signUp = async (req: Request, res: Response) => {
        try {
            const { name, email, password, phone, document_type, document_number, is_admin } = req.body;

            const input = this.userDTO.signUp(name, email, password, phone, document_type, document_number, is_admin);

            const output = await this.userBusiness.signUp(input);

            res.status(201).send(output);

        } catch (error) {
            console.log(error);

            if (req.statusCode === 200) {
                res.status(500);
            }

            if (error instanceof Error) {
                res.send(error.message);
            } else {
                res.send("Erro inesperado");
            }
        }
    }

    public login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const input = this.userDTO.login(email, password);
            const output = await this.userBusiness.login(input);

            res.status(200).send(output);

        } catch (error) {
            console.log(error);

            if (req.statusCode === 200) {
                res.status(500);
            }

            if (error instanceof Error) {
                res.send(error.message);
            } else {
                res.send("Erro inesperado");
            }
        }
    }
}
