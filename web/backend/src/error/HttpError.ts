export default class HttpError extends Error {

    constructor(
        message: string,
        public readonly statusCode?: number,
    ) {
        super(message)
    }

}