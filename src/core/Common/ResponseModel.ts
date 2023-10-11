import { HttpStatus } from "@nestjs/common";
export class ResponseData<T> {
    statusCode : HttpStatus;
    message : [string];
    data : T ;

    constructor(){
        this.statusCode = null; 
        this.message = [''];
        this.data = null;
    }
}