import { NOTE_REPOSITORY, USER_NOTE_REPOSITORY } from '../../core/constants';
import { UserNote } from '../userNote/userNote.entity';
import { Note } from './note.entity';

export const noteProviders = [
    {
        provide: NOTE_REPOSITORY,
        useValue: Note,
    },
    {
        provide: USER_NOTE_REPOSITORY,
        useValue: UserNote,
    }
    
];