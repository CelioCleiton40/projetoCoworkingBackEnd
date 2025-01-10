import { BaseDatabase } from "./BaseDataBase";
import { User } from "../types/index";
import logger from "../utils/logger";
import * as Joi from 'joi';  // Usando Joi para validação de dados

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = "users";

  // Schema de validação para o cadastro de usuário
  private static signUpSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
      'string.base': 'O nome deve ser uma string.',
      'string.min': 'O nome deve ter pelo menos 3 caracteres.',
      'any.required': 'O nome é obrigatório.'
    }),
    email: Joi.string().email().required().messages({
      'string.base': 'O email deve ser uma string.',
      'string.email': 'O email deve ser válido.',
      'any.required': 'O email é obrigatório.'
    }),
    password: Joi.string().min(6).required().messages({
      'string.base': 'A senha deve ser uma string.',
      'string.min': 'A senha deve ter pelo menos 6 caracteres.',
      'any.required': 'A senha é obrigatória.'
    }),
    phone: Joi.string().optional(),
    document_type: Joi.string().optional(),
    document_number: Joi.string().optional(),
    is_admin: Joi.number().optional()
  });

  // Recuperar todos os usuários
  public async getAllUsers(): Promise<User[]> {
    try {
      const users: User[] = await BaseDatabase.connection(
        UserDatabase.TABLE_USERS
      ).select();

      return users;
    } catch (error: any) {
      logger.error(`Erro ao buscar todos os usuários: ${error.message}`);
      throw new Error("Falha ao buscar usuários. Por favor, tente novamente.");
    }
  }

  // Atualizar usuário
  public async updateUser(
    id: number,
    updatedData: Partial<User>
  ): Promise<void> {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      await BaseDatabase.connection(UserDatabase.TABLE_USERS)
        .where({ id })
        .update(updatedData);
    } catch (error: any) {
      logger.error(`Erro ao atualizar usuário no banco de dados: ${error.message}`);
      throw new Error(error.message || "Falha ao atualizar usuário.");
    }
  }

  // Cadastro de novo usuário
  public async signUp(newUser: User): Promise<void> {
    const trx = await BaseDatabase.connection.transaction();

    try {
      // Validação dos dados do usuário
      const { error } = UserDatabase.signUpSchema.validate(newUser);
      if (error) {
        throw new Error(error.details.map(e => e.message).join(", "));
      }

      // Verificar se o usuário já existe
      const existingUser = await this.getUserByEmail(newUser.email);
      if (existingUser) {
        throw new Error("Usuário já cadastrado com esse email.");
      }

      // Inserir novo usuário
      await trx.insert(newUser).into(UserDatabase.TABLE_USERS);

      // Confirmar a transação
      await trx.commit();
    } catch (error: any) {
      // Reverter a transação em caso de erro
      await trx.rollback();
      logger.error(`Erro ao cadastrar usuário: ${error.message}`);
      throw new Error(error.message || "Falha ao cadastrar usuário.");
    }
  }

  // Buscar usuário pelo email
  public async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user: User | undefined = await BaseDatabase.connection(
        UserDatabase.TABLE_USERS
      )
        .where({ email })
        .first();

      return user;
    } catch (error: any) {
      logger.error(`Erro ao buscar usuário por email: ${error.message}`);
      throw new Error("Falha ao buscar usuário. Por favor, tente novamente.");
    }
  }

  // Buscar usuário pelo ID
  public async getUserById(id: number): Promise<User | undefined> {
    try {
      const user: User | undefined = await BaseDatabase.connection(
        UserDatabase.TABLE_USERS
      )
        .where({ id })
        .first();

      return user;
    } catch (error: any) {
      logger.error(`Erro ao buscar usuário por ID: ${error.message}`);
      throw new Error("Falha ao buscar usuário. Por favor, tente novamente.");
    }
  }

  // Deletar usuário pelo ID
  public async deleteUserById(id: number): Promise<void> {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      await BaseDatabase.connection(UserDatabase.TABLE_USERS)
        .where({ id })
        .del();
    } catch (error: any) {
      logger.error(`Erro ao deletar usuário com ID ${id}: ${error.message}`);
      throw new Error(error.message || "Falha ao deletar usuário.");
    }
  }

  // Deletar usuário pelo email
  public async deleteUserByEmail(email: string): Promise<void> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      await BaseDatabase.connection(UserDatabase.TABLE_USERS)
        .where({ email })
        .del();
    } catch (error: any) {
      logger.error(`Erro ao deletar usuário com email ${email}: ${error.message}`);
      throw new Error(error.message || "Falha ao deletar usuário.");
    }
  }
}
