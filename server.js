const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const Post = require('./models/post')
const postRouter = require('./routes/post')

// connection to mongodb
mongoose.connect('mongodb://localhost/blog')

// create and express app
const app = express()
// set the templating engin
app.set('view engine', 'ejs')
// middleware for getting the data passed from a form
app.use(express.urlencoded({ extended: false }))
// middle ware for using more http verbs in the html
app.use(methodOverride('_method'))

// root route
app.get('/', async (req, res) => {
  const posts = await Post.find()
  res.render('allPosts', { posts })
})

// post routes
app.use('/posts', postRouter)

// listening to requests
app.listen(3000)
