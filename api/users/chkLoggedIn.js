
const passport = require('passport')

module.exports.isLoggedIn = (req, res, next) => {
  passport.authenticate('access', { session: false }, (err, user, info) => {
    if (user) {
      req.user = user
      next()
    } else {
      res.status(401).json({
        user: null,
        status: false,
        info: '로그인 되지 않았습니다.'
      })
    }
  })(req, res, next)
}