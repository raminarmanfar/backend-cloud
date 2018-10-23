export class ServiceResponse {
    public success: boolean;
    public message: string;
    public data: any;

    /**
     * Creates an instance of ServiceResponse.
     * @param {boolean} success 
     * @param {string} message 
     * @param {*} [data] 
     * @memberof ServiceResponse
     */
    constructor(success: boolean, message: string, data?: any) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}
