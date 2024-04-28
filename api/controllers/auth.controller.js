import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import {errorHandler} from "../utils/error.js";

export const signUp = async (req, res,next) => {
  const { username, email, password } = req.body;
  if(!username ||!email ||!password) {
    next(errorHandler(400, "Please provide all required fields"))
  }
  try {
    await User.create({ username, email, password: bcryptjs.hashSync( password,10) });
    res.status(200).json({ success: true, message: "Sing up successfully" });
  } catch (error) {
    next(error);
  }
};
