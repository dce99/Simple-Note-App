import { Module } from '@nestjs/common';
import { UserNoteService } from './userNote.service';
import { userNoteProviders } from './userNote.providers';


@Module({
    imports: [],
    providers: [UserNoteService, ...userNoteProviders],
    exports: [UserNoteService],
    controllers: [],
})
export class UserNoteModule { }