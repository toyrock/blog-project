const express = require('express')
const { append, send } = require('express/lib/response')
const Post = require('./../models/post')

// new router for the post feature
const router = express.Router()

// form for creating a new post
router.get('/create', (req, res) => {
  const post = new Post()
  res.render('createPost', { post })
})

// form for updating an existing post
router.get('/update/:id', async (req, res) => {
  const post = await Post.findById(req.params.id)
  res.render('updatePost', { post })
})

// route for handling the update of an existing post
router.put(
  '/:id',
  async (req, res, next) => {
    req.post = await Post.findById(req.params.id)
    next()
  },
  savePostAndRedirect('updatePost')
)

// route for handling the creating of a new post
router.post(
  '/',
  async (req, res, next) => {
    req.post = new Post()
    next()
  },
  savePostAndRedirect('createPost')
)

function savePostAndRedirect(template) {
  return async (req, res) => {
    console.log(req.post)
    req.post.title = req.body.title
    req.post.description = req.body.description
    req.post.markdown = req.body.markdown
    try {
      await req.post.save()
      res.redirect('/')
    } catch (error) {
      res.render(template, { post: req.post })
    }
  }
}

// export the router to be used externaly
module.exports = router
