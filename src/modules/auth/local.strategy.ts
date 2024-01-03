import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password'
        });
    }

    async validate(email: string, password: string): Promise<any> {
        let valid_email = email.split(/\s/).join('');
        valid_email = valid_email.toLowerCase();
        const valid_password = password.split(/\s/).join('');
        const user = await this.authService.validateUser(valid_email, valid_password);
        if (!user) 
            throw new UnauthorizedException('Invalid user credentials');
        return user;
    }
}