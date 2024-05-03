import {errorHandler} from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const {content, postId, userId} = req.body;
    if (userId !== req.user.id) {
      return next(errorHandler(403, 'You are not allowed to create this comment.'))
    }
    const comment = await Comment.create({postId, content, userId});
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({message: "Internal Server Error: " + error});
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({postId: req.params.postId}).sort({
      createdAt: -1
    })
    res.status(200).json(comments);
  } catch (error) {
    return next(errorHandler(500, "Internal Server Error: " + error));
  }
}
