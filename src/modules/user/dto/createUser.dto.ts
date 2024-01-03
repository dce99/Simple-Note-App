import { IsNotEmpty, MinLength, IsEmail, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';

enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    OTHER = 'Other',
}

export class CreateUserDto {

    @ApiProperty()
    @IsNotEmpty({ message: 'Name is required' })
    readonly name: string;    

    @ApiProperty()
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6)
    readonly password: string;

    @ApiPropertyOptional()
    readonly contact_no: string;

    @ApiPropertyOptional()
    readonly date_of_birth: Date;

    @ApiPropertyOptional()
    // @IsEnum(Gender, {
    //     message: 'Gender must be either Male, Female or Other',
    // })
    readonly gender: string;
    
}