import { Budget } from "src/budgets/entities/budget.entity";
import { TransactionType } from "src/common/enums/transations.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @Column()
    description: string;

    @Column()
    date: Date;

    @Column({ type: 'float'})
    total: number;

    @Column({
        type: 'enum',
        enum: TransactionType
    })
    type: TransactionType

    @ManyToOne(() => Budget, (budget) => budget.transactions)
    budget: Budget;
}
