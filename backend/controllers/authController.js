import bcrypt from "bcryptjs";

import User from "../models/User.js";

import { generateToken } from "../utils/generateToken.js";


export const register = async (req, res, next) => {

  try {

    const {
      name,
      email,
      password,
      role,
      department
    } = req.body;

    if (!name || !email || !password) {

      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });

    }

    if (password.length < 6) {

      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });

    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {

      return res.status(409).json({
        success: false,
        message: "User already exists"
      });

    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    /*
      For security:
      Public registration creates only student accounts.
      Staff/Admin accounts should be created separately.
    */

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "student",
      department: department || ""
    });

    const token = generateToken(user._id);

    res.status(201).json({

      success: true,

      message: "Registration successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }

    });

  } catch (error) {

    next(error);

  }

};


export const login = async (req, res, next) => {

  try {

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });

    }

    const user = await User.findOne({
      email: email.toLowerCase()
    }).select("+password");

    if (
      !user ||
      !(await bcrypt.compare(
        password,
        user.password
      ))
    ) {

      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });

    }

    const token = generateToken(user._id);

    res.json({

      success: true,

      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }

    });

  } catch (error) {

    next(error);

  }

};


export const getMe = async (req, res) => {

  res.json({
    success: true,
    user: req.user
  });

};