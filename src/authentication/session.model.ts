import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';  // Assuming User model already exists

@Table({ tableName: 'sessions', timestamps: true, })

export class Session extends Model<Session> {

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,  // Notification token can be optional
    })
    notificationToken: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    accessToken: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,  // User agent may not always be provided
    })
    userAgent: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,  // IP address might be optional in certain cases
    })
    ipAddress: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,  // Device name may not always be provided
    })
    deviceName: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,  // Platform may not always be provided
    })
    platform: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,  // Version may not always be provided
    })
    version: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,  // Assuming a session is active by default
    })
    isActive: boolean;

    @BelongsTo(() => User)
    user: User;
}
