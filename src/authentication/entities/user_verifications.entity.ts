import { Column, Model, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './user.entity';

@Table({
  tableName: 'user_verifications', // Set the table name
  timestamps: true, // Automatically handle createdAt and updatedAt
})
export class UserVerification extends Model<UserVerification> {
    
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  verificationCode: number;
  

}
