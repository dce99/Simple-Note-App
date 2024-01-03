import { Controller, Get, UseGuards, Req, All, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { CustomDataBaseException } from '../../core/exception_filters/custom_exceptions/customDataBaseException';
import { CustomGenericExecption } from '../../core/exception_filters/custom_exceptions/customGenException';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Users')
@Controller('users')
export class UserController {

    constructor(
        private usersService: UserService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('info')
    async getUserDetialsById(@Req() req) {
        const result = await this.usersService.getUserDetailsById(req.user.id);
        if (result instanceof CustomGenericExecption)
            throw result;
        else return result;
    }

    @UseGuards(AuthGuard('jwt'))
    @All()
    async routeNotFound() {
        throw new NotFoundException({ message: 'Route does not exist', error_type: 'NotFoundException' })
    }

}
