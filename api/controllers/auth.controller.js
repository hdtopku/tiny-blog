import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import {errorHandler} from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  const {username, email, password} = req.body;
  if (!username || !email || !password) {
    next(errorHandler(400, "Please provide all required fields"))
  }
  try {
    await User.create({username, email, password: bcryptjs.hashSync(password, 10)});
    res.status(200).json({success: true, message: "Sing up successfully"});
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const {username, password} = req.body;
  if (!username || !password) {
    next(errorHandler(400, "Please provide all required fields"))
  }
  try {
    const user = await User.findOne({username});
    if (!user) {
      return next(errorHandler(400, "Username or password is incorrect"));
    }
    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) {
      return next(errorHandler(400, "Username or password is incorrect"));
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY);
    const {password: pass, ...withoutPass} = user._doc
    return res.status(200).cookie('access_token', token, {
      httpOnly: true
    }).json({success: true, message: 'Sign in successfully', data: withoutPass});
  } catch (error) {
    return next(error);
  }
}
