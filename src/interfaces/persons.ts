import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'persons',
    timestamps: false,
})

export class Persons extends Model<Persons> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    })
    id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    avatar!: string;

    @Column({
        type: DataType.STRING
    })
    token!: string;

}
export default Persons;
