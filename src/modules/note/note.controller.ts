import { Controller, Render, Body, Param, Get, Post, UseGuards, HttpException, Request, UploadedFile, UseInterceptors, HttpStatus, NestInterceptor, Res, Delete, Req, BadRequestException, All, NotFoundException, Query, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NoteService } from './note.service';
import { CustomGenericExecption } from '../../core/exception_filters/custom_exceptions/customGenException';
import { ApiTags } from '@nestjs/swagger';
import { CreateNoteDto } from './dto/createNote.dto';
import { AuthorisedReaderGuard } from '../../core/guards/authorisedReader.guard';



@ApiTags('Notes')
@Controller('notes')
export class NoteController {

    constructor(
        private noteService: NoteService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('')
    async getUserNotes(@Req() req) {
        const result = await this.noteService.getUserNotes(req.user.id);
        if (result instanceof CustomGenericExecption)
            throw result;
        else return result;
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('search')
    async getNotesByKeyword(@Query('q') q: string, @Req() req) {
        const result = await this.noteService.getNotesByKeyword(q, req.user.id);
        if (result instanceof CustomGenericExecption)
            throw result;
        else return result;
    }

    @UseGuards(AuthGuard('jwt'), AuthorisedReaderGuard)
    @Get(':id')
    async getNoteById(@Param('id') id: number, @Req() req) {
        const result = await this.noteService.getNoteById(id);
        if (result instanceof CustomGenericExecption)
            throw result;
        else return result;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('')
    async create(@Body() body: CreateNoteDto, @Req() req) {
        const result = await this.noteService.create(body, req.user.id);
        if (result instanceof CustomGenericExecption)
            throw result;
        else return result;
    }

    @UseGuards(AuthGuard('jwt'), AuthorisedReaderGuard)
    @Put(':id')
    async update(@Param('id') id: number, @Body() body: CreateNoteDto) {
        const result = await this.noteService.update(id, body);
        if (result instanceof CustomGenericExecption)
            throw result;
        else return result;
    }


    @UseGuards(AuthGuard('jwt'), AuthorisedReaderGuard)
    @Delete(':id')
    async delete(@Param('id') id: number, @Req() req) {
        const result = await this.noteService.delete(id, req.user.id);
        if (result instanceof CustomGenericExecption)
            throw result;
        else return result;
    }


    @UseGuards(AuthGuard('jwt'), AuthorisedReaderGuard)
    @Post(':id/share')
    async share(@Param('id') id: number, @Body() body: { share_user_id: number }) {
        const result = await this.noteService.share(id, body.share_user_id);
        if (result instanceof CustomGenericExecption)
            throw result;
        else return result;
    }

}