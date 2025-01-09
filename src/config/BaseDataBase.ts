import knex, { Knex } from 'knex';
import dotenv from 'dotenv';
import logger from '../utils/logger'; // Certifique-se de importar seu logger corretamente

dotenv.config();

interface SQLiteConnection extends Knex.Client {
    run(sql: string, callback: (err: Error | null) => void): void;
}

export class BaseDatabase {
    protected static connection: Knex<any, unknown[]> = knex({
        client: 'sqlite3',
        connection: {
            filename: process.env.DB_FILE_PATH as string,
        },
        useNullAsDefault: true,
        pool: {
            min: 0,
            max: 1,
            afterCreate: (conn: Knex.Client, cb: (err?: Error | null) => void) => {
                (conn as SQLiteConnection).run('PRAGMA foreign_keys = ON', (err: Error | null) => {
                    if (err) {
                        logger.error('Erro ao habilitar chaves estrangeiras:', err);
                    }
                    cb(err);
                });
            },
        },
    });
}
