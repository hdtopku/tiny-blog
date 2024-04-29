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
  const {email, password} = req.body;
  if (!email || !password) {
    next(errorHandler(400, "Please provide all required fields"))
  }
  try {
    const user = await User.findOne({email: email});
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
export const google = async (req, res, next) => {
  const {email, name, googlePhotoUrl} = req.body;
  console.log(email, name, googlePhotoUrl);
  try {
    const user = await User.findOne({email});
    console.log(user);
    if (!user) {
      // toString(36) generates a random string with numbers and lowercase letters of length 8
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = await User.create({
        // toString(9) generates a random generates a random string with numbers string of length 4
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        email, password: hashedPassword, profilePicture: googlePhotoUrl
      });
      const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET_KEY)
      const {password: pass, ...withoutPass} = newUser._doc
      return res.status(200).cookie('access_token', token, {
        httpOnly: true
      }).json({success: true, message: 'Sign in successfully', data: withoutPass});
    } else {
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY);
      const {password: pass, ...withoutPass} = user._doc
      return res.status(200).cookie('access_token', token, {
        httpOnly: true
      }).json({success: true, message: 'Sign in successfully', data: withoutPass});
    }

  } catch (error) {
    return next(error);
  }
}
