import { Table, Column, Model, DataType, Index, BelongsToMany } from 'sequelize-typescript';
import { UserNote } from '../userNote/userNote.entity';
import { Note } from '../note/note.entity';

@Table
export class User extends Model<User> {

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Index({
        name: 'user_email_idx',
        unique: true,
        using: 'BTREE',
    })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    date_of_birth: Date;

    @Column({
        type: DataType.STRING,
        values: ['Male', 'Female', 'Other'],
        allowNull: true,
    })
    gender: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    contact_no: string;


    @BelongsToMany(() => Note, () => UserNote)
    notes: Note[];

}