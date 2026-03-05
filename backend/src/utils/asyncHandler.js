const asyncHandler = (handelRequest) => {
    return (req,res,next) => {
        Promise
        .resolve(handelRequest(req,res,next))
        .catch((err) => next(err))
    }
}

export {asyncHandler} 