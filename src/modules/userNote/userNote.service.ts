import { Injectable, Inject } from '@nestjs/common';
import { USER_NOTE_REPOSITORY } from '../../core/constants';
import { DatabaseError } from "sequelize";
import { CustomDataBaseException } from '../../core/exception_filters/custom_exceptions/customDataBaseException';
import { CustomGenericExecption } from '../../core/exception_filters/custom_exceptions/customGenException';
import { UserNote } from './userNote.entity';


@Injectable()
export class UserNoteService {

    constructor(
        @Inject(USER_NOTE_REPOSITORY) private readonly userNoteRepository: typeof UserNote,
    ) { }


    async findAllByUserId(user_id: number) {
        const data = await this.userNoteRepository.findAll({
            where: { user_id }
        });
        const note_ids = data.map((d) => d.note_id);
        return note_ids;
    }

    async findAllByNoteId(note_id: number) {
        const data = await this.userNoteRepository.findAll({
            where: { note_id }
        });
        const user_ids = data.map((d) => d.user_id);
        return user_ids;
    }

    async deleteAllByNoteId(user_id: number, note_id: number) {
        return this.userNoteRepository.destroy({
            where: { note_id, user_id }
        })
    }

    async exist(user_id: number, note_id: number) {
        const note = await this.userNoteRepository.findOne({
            where: { user_id, note_id }
        });
        return (note) ? true : false;
    }


    async create(data: { user_id: number, note_id: number, owner: boolean }) {
        try {
            const note = await this.userNoteRepository.create<UserNote>({
                ...data,
            });

            // add logic for adding entry to userNotes table
            return { success: true, status_code: 201, message: 'Note created', data: { note } };
        } catch (error) {
            if (error instanceof DatabaseError)
                throw new CustomDataBaseException(error);
            else
                throw new CustomGenericExecption({ status_code: error.status, message: error.message, error_type: (error.response) ? error.response.error_type : 500 }, error.status)
        }
    }

    async delete(user_id: number, note_id: number) {
        try {

            await this.userNoteRepository.destroy(
                {
                    where: { user_id, note_id }
                });
            // add logic for deleting entry from userNotes table
            return { success: true, status_code: 201, message: 'Note updated' };
        } catch (error) {
            if (error instanceof DatabaseError)
                throw new CustomDataBaseException(error);
            else
                throw new CustomGenericExecption({ status_code: error.status, message: error.message, error_type: (error.response) ? error.response.error_type : 500 }, error.status)
        }
    }



}