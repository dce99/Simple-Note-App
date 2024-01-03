import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../../core/database/database.module';
import { AuthModule } from './auth.module';
import { NoteModule } from '../note/note.module';
import { UserNoteModule } from '../userNote/userNote.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ValidationGlobalPipe } from '../../core/pipes/globalValidation.pipe';
import { AllExceptionsFilter } from '../../core/exception_filters/allExceptionFilter';
import { ExcludeNullInterceptor } from '../../core/interceptors/excludeNull.interceptor';
import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';

let authController: AuthController;
let authService: AuthService;
let userService: UserService;

let app: INestApplication;
beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
        imports: [DatabaseModule, AuthModule, UserModule, NoteModule, UserNoteModule],
        controllers: [AppController],
        providers: [AppService],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationGlobalPipe({
        transform: true
    }));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new ExcludeNullInterceptor());
    await app.init();


    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
});


type ResponseType = {
    success: boolean,
    status_code: number,
    message: string,
    data: any,
    errors: any[],
    error_type: string,
}

describe("auth", function () {

    let user: { email: string, name: string};
    let user_id: number;
    it("Should signup with email, password and name", async function () {

        const users = await userService.findAll();
        const length = users.length + 1;
        //@ts-ignore
        const result: ResponseType = await authService.signup({ email: `test${length}@example.com`, password: "123456", name: `test${length}` });

        user = { name: result.data?.user?.name, email: result.data?.user?.email };
        user_id = result.data?.user?.id;
        expect(user).toEqual({ email: `test${length}@example.com`, name: `test${length}` });
    });

    it("Should login with email and password", async function () {
        
        //@ts-ignore
        const result: ResponseType = await authService.login({ email: user.email, password: "123456" }, user_id);
        expect(result?.data?.user?.email).toEqual(user.email);

        const token: string = result.data?.token;
        expect(token).toBeDefined();
        expect(token.length).toBeGreaterThan(0);
    });


})

afterAll(async () => {
    await app.close();
});


