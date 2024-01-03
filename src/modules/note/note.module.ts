import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { noteProviders } from './note.providers';
import { NoteController } from './note.controller';
import { UserNoteModule } from '../userNote/userNote.module';


@Module({
    imports: [UserNoteModule],
    providers: [NoteService, ...noteProviders],
    exports: [NoteService],
    controllers: [NoteController],
})
export class NoteModule { }