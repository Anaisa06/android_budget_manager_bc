import { Category } from "src/categories/entities/category.entity";
import { BudgetFrecuency, BugdetType } from "src/common/enums/budget.enum";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('budgets')
export class Budget {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({ type: 'float'})
    total: number;

    @Column({
        type: 'enum',
        enum: BugdetType
    })
    type: BugdetType;

    @Column({
        type: 'enum',
        enum: BudgetFrecuency,
        nullable: true
    })
    frequency: BudgetFrecuency

    @ManyToOne(() => User, (user) => user.budgets)
    user: User;

    @ManyToOne(() => Category)
    category: Category

    @OneToMany(() => Transaction, (transaction) => transaction.budget)
    transactions: Transaction[]
}
