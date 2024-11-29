import { Budget } from "src/budgets/entities/budget.entity";
import { Category } from "src/categories/entities/category.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: false })
    onboarding: boolean;

    @OneToMany(() => Category, (category) => category.user)
    categories: Category[];

    @OneToMany(() => Budget, (budget) => budget.user)
    budgets: Budget[];
}
