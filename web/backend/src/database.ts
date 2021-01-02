import { createConnection } from 'typeorm';
import config from './config';

export interface Modpack {
    name?: string;
    link: string;
}

export default async () => {

    const db = await createConnection({ ...config.database })

    /*
    if (config.database.synchronize) {
        await db.query(`PRAGMA foreign_keys = OFF;`)
        await db.synchronize();
        await db.query(`PRAGMA foreign_keys = ON;`)
    }
    */

    return db;
}
