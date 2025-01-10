import knex, { Knex } from 'knex';
import dotenv from 'dotenv';
import logger from '../utils/logger'; // Certifique-se de importar seu logger corretamente

dotenv.config();

export class BaseDatabase {
  // Verificação se a variável de ambiente DB_FILE_PATH está definida
  private static validateEnv(): void {
    if (!process.env.DB_FILE_PATH) {
      logger.error('O caminho do arquivo do banco de dados não está definido em DB_FILE_PATH');
      throw new Error('O caminho do arquivo do banco de dados não está definido em DB_FILE_PATH');
    }
  }

  // Conexão com o banco de dados
  protected static connection: Knex<any, unknown[]>;

  // Iniciando a conexão
  static {
    try {
      this.validateEnv(); // Valida a configuração do arquivo de banco de dados

      this.connection = knex({
        client: 'sqlite3',
        connection: {
          filename: process.env.DB_FILE_PATH as string,
        },
        useNullAsDefault: true,
        pool: {
          min: 0,
          max: 1,
          afterCreate: (conn: Knex.Client, cb: (err?: Error | null) => void) => {
            conn.raw('PRAGMA foreign_keys = ON')
              .then(() => cb())
              .catch((err: Error) => {
                logger.error('Erro ao habilitar chaves estrangeiras:', err);
                cb(err);
              });
          },
        },
      });

      logger.info('Conexão com o banco de dados iniciada com sucesso.');

    } catch (error: any) {
      logger.error(`Erro ao iniciar a conexão com o banco de dados: ${error.message}`);
      throw new Error('Falha ao estabelecer conexão com o banco de dados.');
    }
  }
}
