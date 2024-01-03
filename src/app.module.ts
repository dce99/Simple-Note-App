import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './core/database/database.module';
import { UserModule } from './modules/user/user.module';
import { NoteModule } from './modules/note/note.module';
import { UserNoteModule } from './modules/userNote/userNote.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    DatabaseModule,
    AuthModule,
    UserModule,
    NoteModule,
    UserNoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
