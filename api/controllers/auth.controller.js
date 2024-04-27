import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  if(!username ||!email ||!password) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }
  try {
    await User.create({ username, email, password: bcryptjs.hashSync( password,10) });
    res.status(200).json({ message: "Sing up successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
