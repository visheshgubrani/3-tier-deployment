import User from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import generateTokens from "../utils/generateTokens.js"
import jwt from "jsonwebtoken"

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body
  if (!(username && password && email)) {
    throw new ApiError("400", "Enter all details")
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  })

  if (existingUser) {
    throw new ApiError(400, "User Already Exists")
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
  })

  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  )

  return res
    .status(201)
    .json(new ApiResponse(201, "User Created Successfully", createdUser))
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!(email && password)) {
    throw new ApiError(400, "Enter all details")
  }

  const existingUser = await User.findOne({ email })

  if (!existingUser) {
    throw new ApiError(400, "User does not exist")
  }

  const isPasswordCorrect = await existingUser.isPasswordCorrect(password)

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect Password")
  }

  const { accessToken, refreshToken } = await generateTokens(existingUser?._id)

  const loggedInUser = await User.findById(existingUser?._id).select(
    "-password -refreshToken"
  )
  const accessTokenOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000,
  }

  const refreshTokenOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000,
  }
  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshAccessToken)
    .json(
      new ApiResponse(200, "User loggedIn Successfully", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    )
})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  )

  const options = {
    httpOnly: true,
    secure: false,
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User LoggedOut SuccessFully", {}))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used")
    }

    const { accessToken, newRefreshToken } = await generateTokens(user?._id)

    const options = {
      httpOnly: true,
      secure: false,
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed"
        )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token")
  }
})

export { registerUser, loginUser, logoutUser, refreshAccessToken }
