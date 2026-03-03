class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something Went Wrong",
        error = [],
        stack = ""
){
    super(message);

    this.statusCode = statusCode
    this.data = null
    this.success = false
    this.message = message
    this.error = error
    this.stack = stack
}
}

export default ApiError
