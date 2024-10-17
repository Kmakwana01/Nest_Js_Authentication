// src/user/user.model.ts
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, IsEmail, AllowNull, Default, Unique } from 'sequelize-typescript';

@Table({
  tableName: 'users', // Explicitly define the table name
  timestamps: true,   // Enable timestamps for createdAt and updatedAt fields
})

export class User extends Model<User> {

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(30), // Limiting the length for better performance
    allowNull: false,
  })
  username: string;

  @AllowNull(false)
  @IsEmail // Validate email format
  @Unique // Ensure the email is unique
  @Column({
    type: DataType.STRING(255), // Increased length for emails
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING(255), // Increased length for passwords (hash)
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ENUM('user', 'admin', 'superadmin','merchant'), // Define specific roles
    allowNull: false,
  })
  role: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profileImage: string;

  @Column({
    type: DataType.STRING(15), // Better suited for mobile numbers
    allowNull: true,
  })
  mobileNumber: string; // Changed type to string to allow formats like '+123456789'

  @Default(false) // Default to false
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isDeleted: boolean;

  @CreatedAt
  @Column({
    field: 'created_at',
    type: DataType.DATE,
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    field: 'updated_at',
    type: DataType.DATE,
  })
  updatedAt: Date;
}
