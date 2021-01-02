import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Wallet from "./Wallet";

export enum Status {
    FULLFILLED = 'fullfilled',
    DECLINED = 'declined',
    OPEN = 'open',
}

@Entity()
export default class Transaction extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Wallet, { eager: true })
    @JoinColumn()
    from!: Wallet

    @ManyToOne(() => Wallet, { eager: true })
    @JoinColumn()
    to!: Wallet

    @Column({ unsigned: true })
    amount!: number;

    @Column({ type: 'enum', enum: Status, default: Status.OPEN })
    status!: Status;

    @Column({ length: 256 })
    description!: string;

}