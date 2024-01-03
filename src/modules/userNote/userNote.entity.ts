import { Table, Column, Model, DataType, Index, ForeignKey } from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Note } from '../note/note.entity';

@Table
export class UserNote extends Model<UserNote> {

    @ForeignKey(() => User)
    @Column({
        primaryKey: true,
        type: DataType.NUMBER,
        onDelete: 'CASCADE',
    })
    user_id: number;

    @ForeignKey(() => Note)
    @Column({
        primaryKey: true,
        type: DataType.NUMBER,
        onDelete: 'CASCADE',
    })
    note_id: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    owner: boolean;

} 