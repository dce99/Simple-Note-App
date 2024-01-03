import { Injectable, Inject } from '@nestjs/common';
import { NOTE_REPOSITORY, USER_NOTE_REPOSITORY } from '../../core/constants';
import { DatabaseError, Op } from "sequelize";
import { CustomDataBaseException } from '../../core/exception_filters/custom_exceptions/customDataBaseException';
import { CustomGenericExecption } from '../../core/exception_filters/custom_exceptions/customGenException';
import { Note } from './note.entity';
import { CreateNoteDto } from './dto/createNote.dto';
import { UserNoteService } from '../userNote/userNote.service';


@Injectable()
export class NoteService {

    constructor(
        @Inject(NOTE_REPOSITORY) private readonly noteRepository: typeof Note,
        private readonly userNoteService: UserNoteService,
    ) { }


    async create(data: CreateNoteDto, user_id: number) {
        try {
            const note = await this.noteRepository.create<Note>({
                ...data,
            });

            await this.userNoteService.create({ user_id: user_id, note_id: note.id, owner: true });
            return { success: true, status_code: 201, message: 'Note created', data: { note } };
        } catch (error) {
            if (error instanceof DatabaseError)
                return new CustomDataBaseException(error);
            else
                return new CustomGenericExecption({ status_code: error.status, message: error.message, error_type: (error.response) ? error.response.error_type : 500 }, error.status)
        }
    }

    async getNoteById(note_id: number) {
        try {
            const note = await this.noteRepository.findOne({
                where: { id: note_id }
            });
            return { success: true, status_code: 201, message: 'Note fetched', data: { note } };
        } catch (error) {
            if (error instanceof DatabaseError)
                return new CustomDataBaseException(error);
            else
                return new CustomGenericExecption({ status_code: error.status, message: error.message, error_type: (error.response) ? error.response.error_type : 500 }, error.status)
        }
    }

    async getNotesByKeyword(q: string, user_id: number) {
        try {
            const query = String(q).toLowerCase();
            const note_ids = await this.userNoteService.findAllByUserId(user_id);
            const notes = await this.noteRepository.findAll({
                where: {
                    [Op.or]: [{ title: { [Op.iLike]: `%${query}%` } }, { text: { [Op.iLike]: `%${query}%` } }],
                    id: note_ids,
                },
            });
            return { success: true, status_code: 201, message: 'Notes fetched', data: { notes } };
        } catch (error) {
            if (error instanceof DatabaseError)
                return new CustomDataBaseException(error);
            else
                return new CustomGenericExecption({ status_code: error.status, message: error.message, error_type: (error.response) ? error.response.error_type : 500 }, error.status)
        }
    }

    async getUserNotes(user_id: number) {
        try {
            const note_ids = await this.userNoteService.findAllByUserId(user_id);
            const notes = await this.noteRepository.findAll({
                where: { id: note_ids }
            });
            return { success: true, status_code: 201, message: 'Notes fetched', data: { notes } };
        } catch (error) {
            if (error instanceof DatabaseError)
                return new CustomDataBaseException(error);
            else
                return new CustomGenericExecption({ status_code: error.status, message: error.message, error_type: (error.response) ? error.response.error_type : 500 }, error.status)
        }
    }

    async update(id: number, data: CreateNoteDto) {
        try {

            await this.noteRepository.update(
                {
                    title: data.title,
                    text: data.text,
                },
                {
                    where: { id }
                })
            return { success: true, status_code: 201, message: 'Note updated' };
        } catch (error) {
            if (error instanceof DatabaseError)
                return new CustomDataBaseException(error);
            else
                return new CustomGenericExecption({ status_code: error.status, message: error.message, error_type: (error.response) ? error.response.error_type : 500 }, error.status)
        }
    }

    async delete(id: number, user_id: number) {
        try {

            await this.userNoteService.delete(user_id, id);
            const user_ids: number[] = await this.userNoteService.findAllByNoteId(id);
            if (user_ids.length == 0)
                await this.noteRepository.destroy(
                    {
                        where: { id }
                    });
            return { success: true, status_code: 201, message: 'Note deleted' };
        } catch (error) {
            if (error instanceof DatabaseError)
                return new CustomDataBaseException(error);
            else
                return new CustomGenericExecption({ status_code: error.status, message: error.message, error_type: (error.response) ? error.response.error_type : 500 }, error.status)
        }
    }

    async share(id: number, share_user_id: number) {
        try {
            await this.userNoteService.create({ user_id: share_user_id, note_id: id, owner: false });
            return { success: true, status_code: 201, message: 'Note shared' };
        } catch (error) {
            if (error instanceof DatabaseError)
                return new CustomDataBaseException(error);
            else
                return new CustomGenericExecption({ status_code: error.status, message: error.message, error_type: (error.response) ? error.response.error_type : 500 }, error.status)
        }
    }


}