
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, HttpStatus } from '@nestjs/common';
import { validate, ValidatorOptions } from 'class-validator';
import { plainToClass } from 'class-transformer';

export interface ValidationPipeOptions extends ValidatorOptions {
    transform?: boolean;
}


@Injectable()
export class ValidationGlobalPipe implements PipeTransform<any> {
    constructor(private options: ValidationPipeOptions) { }

    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object, this.options);
        if (errors.length > 0) {
            const constraints: any[] = errors.map((error) => {
                return { name: 'ValidationError', property: error.property, description: Object.values(error.constraints) }
            });
            const error_object = {
                status_code: 400,
                message: 'Invalid Input',
                detail: 'Please provide the required fields and verify the input.',
                error_type: 'ValidationException',
                errors: constraints,
            }
            throw new BadRequestException(error_object, 'Please provide the required fields and verify the input.');
        }
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
