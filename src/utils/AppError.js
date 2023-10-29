class AppError {
    //parametros que serão utilizados em toda classe
    message;
    statusCode;

    constructor(message,statusCode = 400){
        this.message = message
        this.statusCode = statusCode
    }
}

module.exports = AppError;