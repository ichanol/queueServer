const isAuthorize = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader && authHeader.split(' ')[1]
    if (token) {
      req.fcmToken = token
      next()
    } else {
      return res.status(400).json({
        success: false,
        message: 'Bad request, Your token is missing or corrupted',
      })
    }
  } else {
    res.status(401).json({
      success: false,
      message: 'No authorization header',
    })
  }
}

module.exports = isAuthorize
