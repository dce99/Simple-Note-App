import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { userProviders } from './user.providers';
import { UserController } from './user.controller';


@Module({
    imports: [],
    providers: [UserService, ...userProviders],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule { }