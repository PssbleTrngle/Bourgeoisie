import dotenv from 'dotenv';
import { resolve } from 'path';
import { ConnectionOptions } from 'typeorm';

dotenv.config({ path: './.env' });

const {
    JWT_SECRET, NODE_ENV, TOKEN_EXPIRES_IN,
    DB_NAME, DB_DIALECT, DB_STORAGE, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_SYNC,
} = process.env;

if (!JWT_SECRET) throw new Error('No JWT Secret defined')

const isDev = NODE_ENV === 'development';

const database = {
    host: DB_HOST,
    port: DB_PORT,
    type: DB_DIALECT ?? 'mysql',
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_STORAGE || DB_NAME,
    synchronize: isDev || DB_SYNC === 'true',
    logging: process.env.DB_LOGGING === 'true',
    entities: [
        `${resolve(__dirname, 'models')}/**.js`,
        `${resolve(__dirname, 'models')}/**.ts`,
    ],
} as ConnectionOptions

const files = {
    storage: process.env.STORAGE_DIR ?? 'storage',
    localPacks: process.env.MODPACK_DIR,
}

const api = {
    port: process.env.PORT || 80,
    extension: process.env.API_EXTENSION || 'api',
    logging: process.env.API_LOGGING === 'true',
    crashOnError: !isDev,
}

const auth = {
    jwt_secret: JWT_SECRET,
    expires_in: TOKEN_EXPIRES_IN?.toLowerCase() === 'never' ? null : Number.parseInt(TOKEN_EXPIRES_IN ?? '24'),
}

export default { database, api, auth, files }