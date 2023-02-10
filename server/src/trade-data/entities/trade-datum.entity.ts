import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export enum MarketTrend {
    Up,
    Down,
    Stable,
}

@Entity()
export class TradeDatum {
    @PrimaryGeneratedColumn()
    id: number
       
    @Column({nullable: true})
    name: string;

    @Column()
    code: string;

    @Column()
    currentPrice: number;

    @Column()
    lastPrice?: number;
    
    @Column()
    traderName: string;

    @Column()
    updatedTime: number;

    @Column()
    createdTime: number;

    @Column()
    trend: MarketTrend;

    @Column()
    status: number;
}
