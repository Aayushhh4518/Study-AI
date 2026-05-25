import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register User
// @route   POST /api/auth/register
// @access  Public

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check required fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  // Check existing user
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Response
  res.status(201).json({
    success: true,
    message: "User registered successfully",

    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email });

  // Check password
  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      message: "Login successful",

      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Get User Profile
// @route   GET /api/auth/profile
// @access  Private

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    success: true,
    data: user,
  });
});
