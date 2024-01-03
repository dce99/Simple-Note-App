import { USER_NOTE_REPOSITORY } from '../../core/constants';
import { UserNote } from './userNote.entity';

export const userNoteProviders = [{
    provide: USER_NOTE_REPOSITORY,
    useValue: UserNote,
}];