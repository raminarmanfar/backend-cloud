export class ServiceResponse {
    /**
     * Creates an instance of ServiceResponse.
     * @param {boolean} success 
     * @param {number} responseCode
     * @param {string} message 
     * @param {*} [data] 
     * @memberof ServiceResponse
     */
    constructor(
        public success: boolean,
        public responseCode: number ,
        public message: string,
        public data?: any
    ) {}
}
