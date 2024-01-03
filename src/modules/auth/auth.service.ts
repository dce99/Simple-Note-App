import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DatabaseError } from 'sequelize';
import { CustomDataBaseException } from '../../core/exception_filters/custom_exceptions/customDataBaseException';
import { CustomGenericExecption } from '../../core/exception_filters/custom_exceptions/customGenException';
import { CreateUserDto } from '../user/dto/createUser.dto';
dotenv.config()

@Injectable()
export class AuthService {

    public loginLink: string;
    public website_url: string;
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }


    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findOneByEmail(email);
        if (!user)
            throw new UnauthorizedException("The email you entered doesn't belong to an account.");
        const match = await this.comparePassword(pass, user.password);
        if (!match)
            return null;
        const { password, ...result } = user['dataValues'];
        return result;
    }

    public async login(user: CreateUserDto, user_id: number): Promise<any> {
        try {
            const data = { id: user_id, email: user.email, name: user.name }
            const token = await this.generateToken(data);

            const user_stripped = this.getUserStrippedObject(user);
            return { success: true, status_code: 201, message: 'Login successful', data: { user: user_stripped, token } };
        }
        catch (error) {
            if (error instanceof DatabaseError)
                return new CustomDataBaseException(error);
            else
                return new CustomGenericExecption({ status_code: error.status, message: error.message, error_type: (error.response) ? error.response.error_type : 500 }, error.status)
        }
    }

    public async signup(user: CreateUserDto): Promise<any> {
        try {
            const exist = await this.userService.findOneByEmail(user.email);
            if (exist)
                throw new BadRequestException({ message: 'This Email is already registered ', error_type: 'BadRequestException', detail: 'Please use another email' })

            const pass: string = await this.hashPassword(user.password);
            const newUser = await this.userService.create({ ...user, password: pass });
            const user_stripped = this.getUserStrippedObject(newUser);

            return { success: true, status_code: 201, message: 'User has been created successfully.', data: { user: user_stripped } };
        }
        catch (error) {
            if (error instanceof DatabaseError)
                return new CustomDataBaseException(error);
            else
                return new CustomGenericExecption({ status_code: error.status, message: error.message, error_type: (error.response) ? error.response.error_type : 500 }, error.status)
        }
    }


    getUserStrippedObject(user) {
        try {
            const properties = ['password', 'gender', 'date_of_birth', 'contact_no', 'updatedAt', 'createdAt'];
            for (let property of properties) {
                if (user.dataValues) {
                    delete user.dataValues[property];
                }
                else {
                    delete user[property];
                }
            }
            return user;
        }
        catch (error) {
            return null;
        }
    }

    private async generateToken(user) {
        const token = await this.jwtService.signAsync(user);
        return token;
    }

    private async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    private async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }

}
