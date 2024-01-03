import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { USER_REPOSITORY } from '../../core/constants';
import { DatabaseError } from "sequelize";
import { CustomDataBaseException } from '../../core/exception_filters/custom_exceptions/customDataBaseException';
import { CustomGenericExecption } from '../../core/exception_filters/custom_exceptions/customGenException';
import { CreateUserDto } from './dto/createUser.dto';


@Injectable()
export class UserService {

    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    ) { }

    async create(user: CreateUserDto): Promise<any> {
        try {
            return await this.userRepository.create<User>({
                ...user,
            });
        } catch (error) {
            return null;
        }
    }

    async findOneByEmail(email: string): Promise<any> {
        try {
            function validateEmail(email) {
                var re = /\S+@\S+\.\S+/;
                return re.test(email);
            }
            const valid_email = validateEmail(email)

            if (valid_email === true) {
                return await this.userRepository.findOne<User>({
                    where: { email }
                });
            }
            else
                return null;

        } catch (error) {
            return null;
        }
    }

    async findOneById(id: number): Promise<any> {
        try {
            return await this.userRepository.findOne<User>(
                {
                    where: { id },
                    attributes: {
                        exclude: ["password"]
                    }
                });
        } catch (error) {
            return null;
        }
    }

    async getUserDetailsById(user_id: number) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: user_id },
                attributes: ['name', 'lastname', 'email', 'gender', 'contact_no']
            })
            return { success: true, status_code: 200, message: 'Data fetched', data: { user } }
        } catch (error) {
            if (error instanceof DatabaseError)
                return new CustomDataBaseException(error);
            else
                return new CustomGenericExecption({ status_code: error.status, message: error.message, error_type: (error.response) ? error.response.error_type : 500 }, error.status)
        }
    }

    async findAll() {
        return this.userRepository.findAll({});
    }



}