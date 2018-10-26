export class ServiceResponse {
    /**
     * Creates an instance of ServiceResponse.
     * @param {boolean} success 
     * @param {number} statusCode
     * @param {string} message 
     * @param {*} [data] 
     * @memberof ServiceResponse
     */
    constructor(
        public success: boolean,
        public statusCode: number ,
        public message: string,
        public data?: any
    ) {}
}
