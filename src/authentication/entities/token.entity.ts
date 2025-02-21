import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.entity';

@Table({ tableName: 'tokens', timestamps: true, })

export class Token extends Model<Token> {

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    accessToken: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,  // Can be null if you don't use refresh tokens
    })
    refreshToken: string;

    @BelongsTo(() => User)
    user: User;
}
