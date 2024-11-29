import { TokenType } from "src/common/enums/token.enum";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('tokens')
export class Token {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'enum',
        enum: TokenType
    })
    type: TokenType

    @Column()
    expirationDate: Date;

    @ManyToOne(() => User)
    user: User;
}
