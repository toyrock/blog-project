const mongoose = require('mongoose')
const marked = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

// the post schema for mongodb
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  markdown: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
})

// before saving to the database
postSchema.pre('validate', function (next) {
  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown))
  }
  next()
})

// export the post model to be used externaly
module.exports = mongoose.model('Post', postSchema)
