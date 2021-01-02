import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import BadRequestError from "../error/BadRequestError";
import Server from "./Server";

@Entity()
@Index('name_per_server', s => [s.owner, s.name], { unique: true })
export default class Wallet extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    owner!: string;

    @ManyToOne(() => Server, s => s.wallets)
    @JoinColumn({ name: 'serverId' })
    server!: Promise<Server> | Server
    serverId!: number;

    @Column()
    cash!: number;

    static findBy(idOrName: string, server?: Server) {
        const id = Number.parseInt(idOrName);
        if (!isNaN(id)) return Wallet.findOne(id);
        if (!server) throw new BadRequestError('Wallet search by name requires server')
        return Wallet.findOne({ name: idOrName, server })
    }

}