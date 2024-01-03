import { Controller, Post, UseGuards, Request, All, NotFoundException, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CustomDataBaseException } from '../../core/exception_filters/custom_exceptions/customDataBaseException';
import { CustomGenericExecption } from '../../core/exception_filters/custom_exceptions/customGenException';
import { CreateUserDto } from '../user/dto/createUser.dto';

@ApiTags('Auth')
@Controller('')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }


    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        const result = await this.authService.login(req.user, req.user.id);
        if (result instanceof CustomGenericExecption)
            throw result;
        else return result;
    }

    @Post('signup')
    async signup(@Body() body: CreateUserDto) {
        const result = await this.authService.signup(body);
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
