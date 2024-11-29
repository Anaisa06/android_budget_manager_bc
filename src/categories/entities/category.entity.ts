import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    isCustom: boolean;

    @Column({ nullable: true })
    icon: string;

    @ManyToOne(() => User, (user) => user.categories, {nullable: true})
    user: User;

}
