const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const user = require('../models/user')

// new router for the post feature
const router = express.Router()

// form for creating a new user
router.get('/signin', (req, res) => {
  res.render('signin')
})

// handling the creating of the new user
router.post('/signin', async (req, res) => {
  const user = new User()
  const hash = await bcrypt.hash(req.body.password, 10)
  user.email = req.body.email
  user.password = hash
  try {
    await user.save()
    res.redirect('/')
  } catch (error) {
    res.redirect('/users/signin')
  }
})

// for m for logging in the user
router.get('/login', (req, res) => {
  res.render('login', { message: '' })
})

// handling the authentication of the user
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (user) {
    const isPwCorrect = await bcrypt.compare(req.body.password, user.password)
    if (isPwCorrect) {
      req.session.currentUser = user
      res.redirect('/users/profile')
    } else {
      res.redirect('/users/login')
    }
  } else {
    res.redirect('/users/login')
  }
})

// route for the user profile
router.get('/profile', (req, res) => {
  const user = req.session.currentUser
  res.render('profile', { user })
})

// route for handling the logout
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/users/login')
})

// export the router to be used externaly
module.exports = router
