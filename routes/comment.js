const express = require('express')
const Post = require('./../models/post')
const Comment = require('./../models/comment')

// new router for the post feature
const router = express.Router()

// route for adding a comment to a post
router.post('/:id', async (req, res) => {
  // get the posts where we want to add the comment
  const post = await Post.findById(req.params.id)
  // create a new comment
  const comment = await Comment.create({
    content: req.body.comment,
  })
  // add the id of the newly created comment to the post
  post.comments.push(comment.id)
  // save the post to the database
  await post.save()
  // redirect to the read post page
  res.redirect(`/posts/${req.params.id}`)
})

// export the router to be used externaly
module.exports = router
