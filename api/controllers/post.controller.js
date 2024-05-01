import {errorHandler} from "../utils/error.js";
import Post from "../models/post.model.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'Only admin can create post'))
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Title and content are required'))
  }

  const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '')
  const newPost = new Post({
    ...req.body,
    slug: slug,
    userId: req.user.id
  })
  try {
    const savedPost = await Post.create(newPost)
    res.status(201).json(savedPost)
  } catch (error) {
    return next(errorHandler(500, error.message))
  }
}
