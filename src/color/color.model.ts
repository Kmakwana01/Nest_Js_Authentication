import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Color extends Model<Color> {
  
  @Column({
    allowNull: false,
    unique: true,  // Enforces uniqueness on the database level
  })
  name: string;

  @Column({
    allowNull: false,
  })
  hexCode: string;
}
