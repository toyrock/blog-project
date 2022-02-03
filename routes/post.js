const express = require('express')
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

// route for handling the deletion of a post
router.delete('/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

// route for handling the read of a post
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('comments')
  res.render('readPost', { post })
})

// middleware for saving the post and redirecting to the correct page
function savePostAndRedirect(template) {
  return async (req, res) => {
    // update the post with new data
    req.post.title = req.body.title
    req.post.description = req.body.description
    req.post.markdown = req.body.markdown
    try {
      // try saving the post to mongodb
      await req.post.save()
      res.redirect('/')
    } catch (error) {
      // if something goes wrong, redirect to the same form (updatePost or createPost)
      res.render(template, { post: req.post })
    }
  }
}

// export the router to be used externaly
module.exports = router
