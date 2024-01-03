import { Test } from '@nestjs/testing';
import { UserModule } from '../src/modules/user/user.module';
import { DatabaseModule } from '../src/core/database/database.module';
import { AuthModule } from '../src/modules/auth/auth.module';
import { NoteModule } from '../src/modules/note/note.module';
import { UserNoteModule } from '../src/modules/userNote/userNote.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ValidationGlobalPipe } from '../src/core/pipes/globalValidation.pipe';
import { AllExceptionsFilter } from '../src/core/exception_filters/allExceptionFilter';
import { ExcludeNullInterceptor } from '../src/core/interceptors/excludeNull.interceptor';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { NoteController } from '../src/modules/note/note.controller';
import { UserService } from '../src/modules/user/user.service';
import { AuthService } from '../src/modules/auth/auth.service';
import { NoteService } from '../src/modules/note/note.service';

let userService: UserService;
let authService: AuthService;
let app: INestApplication;
let user1: { email: string, name: string, id: number };
let user2: { email: string, name: string, id: number };
let token1: string;
let token2: string;
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

describe("Auth (e22)", function () {
  
    it(`/Post signup user1`, async () => {
        let users = await userService.findAll();
        let length = users.length + 1;
        const response = await request(app.getHttpServer())
            .post('/signup')
            .send({ email: `test${length}@example.com`, password: "123456", name: `test${length}` })
            .expect(201);
        const result = JSON.parse(response.text);
        user1 = { name: result.data?.user?.name, email: result.data?.user?.email, id: result.data?.user?.id };
        
    });

    it(`/Post login user1`, async () => {
        const response = await request(app.getHttpServer())
            .post('/login')
            .send({ email: user1.email, password: "123456"})
            .expect(201);
        const result = JSON.parse(response.text);
        token1 = result.data?.token;
        
    });

    it(`/Post signup user2`, async () => {
        let users = await userService.findAll();
        let length = users.length + 1;
        const response = await request(app.getHttpServer())
            .post('/signup')
            .send({ email: `test${length}@example.com`, password: "123456", name: `test${length}` })
            .expect(201);
        const result = JSON.parse(response.text);
        user2 = { name: result.data?.user?.name, email: result.data?.user?.email, id: result.data?.user?.id };
        
    });

    it(`/Post login user2`, async () => {
        const response = await request(app.getHttpServer())
            .post('/login')
            .send({ email: user2.email, password: "123456" })
            .expect(201);
        const result = JSON.parse(response.text);
        token2 = result.data?.token;
        
    });
})

describe("Note (e2e)", function () {

    let created_id ;
    it(`/Post note`, async() => {
        const response = await request(app.getHttpServer()) 
            .post('/notes')
            .send({
                "title": "First Note",
                "text": "Hello, this is my first note"
            })
            .set('Authorization', `Bearer ${token1}`)
            .expect(201);
        const result = JSON.parse(response.text); 
        created_id = result?.data?.note?.id;
        
    });

    it(`/Put note`, async() => {
        const response = await request(app.getHttpServer()) 
            .put(`/notes/${created_id}`)
            .send({
                "title": "Updated first Note",
            })
            .set('Authorization', `Bearer ${token1}`)
            .expect(200)
            
    });

    it(`/Get note by id`, async() => {
        const response = await request(app.getHttpServer()) 
            .get(`/notes/${created_id}`)
            .set('Authorization', `Bearer ${token1}`)
            .expect(200)
        const result = JSON.parse(response.text); 
        const note = result?.data?.note;
        expect(note?.title).toEqual("Updated first Note");
        
    });

    it(`/Get note by very large id`, async() => {
        const response = await request(app.getHttpServer()) 
            .get(`/notes/${10000000}`)
            .set('Authorization', `Bearer ${token1}`)
            .expect(404);
        
    });

    it(`/Get notes of user`, async() => {
        const response = await request(app.getHttpServer()) 
            .get(`/notes`)
            .set('Authorization', `Bearer ${token1}`)
            .expect(200);
        const result = JSON.parse(response.text);
        const notes: any[] = result?.data?.notes;
        expect(notes.length).toEqual(1);
        
    });

    it(`/Get notes by keyword`, async() => {
        const response = await request(app.getHttpServer()) 
            .get(`/notes?q=first`)
            .set('Authorization', `Bearer ${token1}`)
            .expect(200);
        const result = JSON.parse(response.text);
        const notes: any[] = result?.data?.notes;
        expect(notes.length).toEqual(1);
        
    });

    it(`/Post share note`, async () => {

        // sharing note by user1
        let response = await request(app.getHttpServer())
            .post(`/notes/${created_id}/share`)
            .send({
                "share_user_id": user2.id
            })
            .set('Authorization', `Bearer ${token1}`)
            .expect(201);
        
        
        // geting note for user2
        response = await request(app.getHttpServer())
            .get(`/notes/${created_id}`)
            .set('Authorization', `Bearer ${token2}`)
            .expect(200);
        const result = JSON.parse(response.text);
        const note = result?.data?.note;
        expect(note?.title).toEqual("Updated first Note");
        
        
    });

    it(`/Delete note by id`, async() => {

        await request(app.getHttpServer()) 
            .delete(`/notes/${created_id}`)
            .set('Authorization', `Bearer ${token1}`)
            .expect(200);

        // 403 beacause since this note has been shared 
        // with user2, so it does exist, but user1 has no longer access to it
        // If we delete before sharing, response would be 404
        await request(app.getHttpServer()) 
            .get(`/notes/${created_id}`)
            .set('Authorization', `Bearer ${token1}`)
            .expect(403);
        
    });


})

afterAll(async () => {
    await app.close();
    
});


