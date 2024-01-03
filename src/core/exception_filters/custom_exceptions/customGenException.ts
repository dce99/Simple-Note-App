


export class CustomGenericExecption extends Error{
    protected readonly response;
    protected readonly status;
    constructor(response: {status_code: number, message: string, error_type?: string, errors?: any[], detail?: string }, status: number) {
        super();
        this.response = { success: false, ...response };
        this.status = status;
        this.message = this.response.message;
        this.name = this.response.error_type;
    }

    public getStatus(){
        return this.status;
    }

    public getResponse() {
        return this.response;
    }
}