const session = require('express-session')

function isLoggedIn(req, res, next) {
  if (!req.session.currentUser) {
    res.render('login', { message: 'you are not logged in' })
  }
  next()
}

module.exports = isLoggedIn
