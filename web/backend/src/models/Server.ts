import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import config from "../config";
import Hidden from "../decorators/Hidden";
import BadRequestError from "../error/BadRequestError";
import Wallet from "./Wallet";

const { jwt_secret } = config.auth

export interface Settings {
    starting_cash: number
    wallets_per_player: number
}

const defaultSettings: Settings = {
    starting_cash: 64,
    wallets_per_player: 1,
}

export interface Token {
    access_key: string,
    id: number;
    generated_at: number;
}

@Entity()
export default class Server extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    access_key!: string;

    @Hidden()
    @Column()
    password_hash!: string;

    @OneToMany(() => Wallet, w => w.server)
    wallets!: Promise<Wallet[]>

    async getSettings() {
        return defaultSettings;
    }

    private generateToken() {
        const { access_key, id } = this;
        const data: Token = { access_key, id, generated_at: new Date().getTime() };
        const token = jwt.sign(data, jwt_secret)
        return { token, access_key }
    }

    static async login(access_key: string | Server, password: string) {
        const server = typeof access_key === 'string' ? await Server.findOne({ access_key }) : access_key;
        if (!server) throw new BadRequestError('Server not found')

        if (bcrypt.compareSync(password, server.password_hash)) return server.generateToken();
        else throw new BadRequestError('Invalid password')
    }

    static async register(password: string, { }: {}) {

        const access_key = 'test'

        const existing = await Server.findOne({ access_key })
        if (existing) {
            console.log('Existing server tried to register again')
            return Server.login(access_key, password);
        }

        const salt = bcrypt.genSaltSync();
        const password_hash = bcrypt.hashSync(password, salt);

        const server = await Server.create({ access_key, password_hash }).save()
        return server.generateToken();
    }

}