import { CustomGenericExecption } from "./customGenException";



export class CustomForbiddenException extends CustomGenericExecption {
    
    constructor(detail?: string) {
        super({
            message: detail || 'Action Forbidden',
            error_type: 'ForbiddenException',
            detail: detail || 'User is not authorized to perform this action',
            status_code: 403,
            errors: [],
        }, 403);
    }
}