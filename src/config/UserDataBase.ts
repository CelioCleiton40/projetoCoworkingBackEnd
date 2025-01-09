import { BaseDatabase } from "./BaseDataBase";
import { User } from "../types/index";
import logger from "../utils/logger";

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = "users";

  public async getAllUsers(): Promise<User[]> {
    try {
      const users: User[] = await BaseDatabase.connection(
        UserDatabase.TABLE_USERS
      ).select();

      return users;
    } catch (error: any) {
      logger.error(`Erro ao buscar todos os usuários: ${error.message}`);
      throw new Error("Falha ao buscar usuários.");
    }
  }

  public async updateUser(
    id: number,
    updatedData: Partial<User>
  ): Promise<void> {
    try {
      await BaseDatabase.connection(UserDatabase.TABLE_USERS)
        .where({ id })
        .update(updatedData);
    } catch (error: any) {
      logger.error(`Erro ao atualizar usuário no banco de dados: ${error.message}`);
      throw new Error("Falha ao atualizar usuário.");
    }
  }

  public async signUp(newUser: User): Promise<void> {
    try {
      await BaseDatabase.connection(UserDatabase.TABLE_USERS).insert(newUser);
    } catch (error: any) {
      logger.error(`Erro ao cadastrar usuário: ${error.message}`);
      throw new Error("Falha ao cadastrar usuário.");
    }
  }

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
      throw new Error("Falha ao buscar usuário.");
    }
  }

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
      throw new Error("Falha ao buscar usuário.");
    }
  }

  public async deleteUserById(id: number): Promise<void> {
    try {
      await BaseDatabase.connection(UserDatabase.TABLE_USERS)
        .where({ id })
        .del(); // Método del() do Knex.js para DELETE
    } catch (error: any) {
      logger.error(`Erro ao deletar usuário com ID ${id}: ${error.message}`);
      throw new Error("Falha ao deletar usuário.");
    }
  }

  public async deleteUserByEmail(email: string): Promise<void> {
    try {
      await BaseDatabase.connection(UserDatabase.TABLE_USERS)
        .where({ email })
        .del(); // Método del() do Knex.js para DELETE
    } catch (error: any) {
      logger.error(`Erro ao deletar usuário com email ${email}: ${error.message}`);
      throw new Error("Falha ao deletar usuário.");
    }
  }
}
