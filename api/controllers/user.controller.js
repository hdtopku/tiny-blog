import {errorHandler} from "../utils/error.js";
import User from "../models/user.model.js";

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"))
  }
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId)
    res.status(200).json({message: "User deleted successfully", data: deletedUser, success: true})
  } catch (err) {
    return next(errorHandler(500, "Something went wrong: " + err))
  }
}


export const test = (req, res) => {
  res.json({message: "API is working"})
}
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"))
  }
  if (req.body.password && req.body.password.length < 6) {
    return next(errorHandler(403, "password should be at least 6 characters long"))
  }
  if (req.body.username && (req.body.username.length < 7 || req.body.username.length > 20)) {
    return next(errorHandler(403, "username should be between 7 to 20 characters"))
  }
  if (req.body.username?.includes(" ")) {
    return next(errorHandler(403, "username should not contain spaces"))
  }
  if (req.body.username?.toLowerCase() !== req.body.username) {
    return next(errorHandler(403, "username must be lowercase"))
  }
  if (req.body.username && !req.body.username?.match(/^[a-z0-9]+$/)) {
    return next(errorHandler(403, "username should only contain alphabets and numbers"))
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
      $set: {
        username: req.body.username,
        email: req.body.email,
        profilePicture: req.body.profilePicture,
        password: req.body.password
      }
    }, {new: true})
    const {password, ...userWithoutPassword} = updatedUser._doc
    res.status(200).json({message: "User updated successfully", data: userWithoutPassword, success: true})
  } catch (err) {
    return next(errorHandler(500, "Something went wrong: " + err))
  }
}

export const signOut = (req, res, next) => {
  try {
    res.clearCookie('access_token').status(200).json({message: "User signed out successfully", success: true})
  } catch (err) {
    return next(errorHandler(500, "Something went wrong: " + err))
  }
}

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to access this resource"))
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.sort === 'asc' ? 1 : -1
    const users = await User.find().sort({createdAt: sortDirection}).skip(startIndex).limit(limit)
    const usersWithoutPassword = users.map(user => {
      const {password, ...userWithoutPassword} = user._doc
      return userWithoutPassword
    })
    const totalUsers = await User.countDocuments()
    const now = new Date()
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    )
    const lastMonthUsers = await User.countDocuments({createdAt: {$gte: oneMonthAgo}})
    res.status(200).json({
      message: "Users retrieved successfully",
      data: {users: usersWithoutPassword, totalUsers, lastMonthUsers},
      success: true
    })
  } catch (err) {
    return next(errorHandler(500, "Something went wrong: " + err))
  }
}

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return next(errorHandler(404, "User not found"))
    }
    const {password, ...userWithoutPassword} = user._doc
    res.status(200).json({message: "User retrieved successfully", data: userWithoutPassword, success: true})
  } catch (err) {
    return next(errorHandler(500, "Something went wrong: " + err))
  }
}
