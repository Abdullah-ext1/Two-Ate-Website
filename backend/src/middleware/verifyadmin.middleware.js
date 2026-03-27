export const verifyAdmin = (req, res, next) => {

  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required")
  }

  next()
}

//for admin verification so that user cannot acces