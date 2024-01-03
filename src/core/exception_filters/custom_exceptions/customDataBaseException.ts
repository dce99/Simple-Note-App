import { CustomGenericExecption } from "./customGenException";



export class CustomDataBaseException extends CustomGenericExecption {
    
    constructor(exception: any) {
        const response = {
            message : 'Invalid Input',
            status_code : 400,
            error_type: 'DataBaseException',
            errors: [{ name: exception.constructor.name, description: exception.message }],
            detail : '',
        };
        const code = exception.parent.code;
        const code_detail = {
            '23502': 'Not null violation. Please check non-null fields',
            '23503': 'Foreign key violation. Please check the ids provided',
            '23505': 'Unique key violation. Please check the unique fields',
            '42703': 'Undefined column violation. Please check the provied fields. Some fields are invalid'
        }
        response.detail = code_detail[code];
        super(response, 400);
    }
}