import { Table, Column, Model, DataType, Index, BelongsToMany } from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { UserNote } from '../userNote/userNote.entity';

@Table
export class Note extends Model<Note> {

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title: string;

    @Index('note_text_idx')
    @Column({
        type: DataType.STRING(10000),
        allowNull: true,
    })
    text: string;

    @BelongsToMany(() => User, () => UserNote)
    users: User[];

} 