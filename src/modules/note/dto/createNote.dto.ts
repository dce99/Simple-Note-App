import { IsNotEmpty, MinLength, IsEmail, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNoteDto {

    @ApiProperty()
    @IsNotEmpty({ message: 'Title is required' })
    readonly title: string;    

    @ApiProperty()
    readonly text: string;

}