class ApiError extends Error{
    constructor(
        statusCode,
        message='Something went wrong',
        errors=[],
        stack=''
    ){
        super(message)
        this.code=statusCode,
        this.errors=errors,
        this.success=false

        if(stack) this.stack=stack
        else Error.captureStackTrace(this,this.constructor)
    }
}

export default ApiError