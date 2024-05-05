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
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    const userIndex = comment.likes.findIndex(user => user.toString() === req.user.id.toString());
    if (userIndex >= 0) {
      comment.likes.splice(userIndex, 1);
      comment.numberOfLikes--;
    } else {
      comment.likes.push(req.user.id);
      comment.numberOfLikes++;
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    return next(errorHandler(500, "Internal Server Error: " + error));
  }
}

export const editComment = async (req, res, next) => {
  try {
    const {content} = req.body;
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.userId.toString() !== req.user.id.toString() && !req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to edit this comment."));
    }
    const editedComment = await Comment.findByIdAndUpdate(req.params.commentId, {content}, {new: true});
    res.status(200).json(editedComment);
  } catch (error) {
    return next(errorHandler(500, "Internal Server Error: " + error));
  }
}

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.userId.toString() !== req.user.id.toString() && !req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to delete this comment."));
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({message: "Comment deleted successfully"});
  } catch (error) {
    return next(errorHandler(500, "Internal Server Error: " + error));
  }
}

export const getComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to access this resource."));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = parseInt(req.query.sort) === 'desc' ? -1 : 1;
    const comments = await Comment.find().skip(startIndex).limit(limit).sort({createdAt: sortDirection});
    const totalCount = await Comment.countDocuments();
    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    const recentComments = await Comment.countDocuments({createdAt: {$gte: oneMonthAgo}})
    res.status(200).json({comments, totalCount, recentComments});
  } catch (error) {
    return next(errorHandler(500, "Internal Server Error: " + error));
  }
}
