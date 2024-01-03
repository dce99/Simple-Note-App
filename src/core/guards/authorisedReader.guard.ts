import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CustomForbiddenException } from '../exception_filters/custom_exceptions/customForbiddenException';
import { NOTE_REPOSITORY, USER_NOTE_REPOSITORY } from '../constants';

@Injectable()
export class AuthorisedReaderGuard implements CanActivate {
    constructor(
        @Inject(USER_NOTE_REPOSITORY)
        private readonly userNoteRepositroy,
        @Inject(NOTE_REPOSITORY)
        private readonly noteRepositroy,
    ) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request): Promise<any> {
        const user = request.user;
        const note_id = request.params.id || request.body.id;
        if (!note_id)
            throw new BadRequestException({ message: 'Invalid request', error_type: 'BadRequestException', detail: 'id parameter for "GET" is missing' });

        const note = await this.noteRepositroy.findOne({ where: { id: note_id } });
        if (!note)
            throw new NotFoundException({ message: 'Invalid request', error_type: 'NotFoundException', detail: 'Note of given "id" does not exist' });

        const exist = await this.userNoteRepositroy.findOne({
            where: { user_id: user.id, note_id }
        })

        if (exist)
            return true;
        else
            throw new CustomForbiddenException('User is not authorized to perform this action');
    }
}
