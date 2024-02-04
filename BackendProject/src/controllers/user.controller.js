import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadCloudinary } from "../utils/fileupload.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    const userAccess = user.generateAccessToken();
    const userRefresh = user.generateRefreshToken();

    user.refreshToken = userRefresh;
    await user.save({ validateBeforeSave: false });

    return { userAccess, userRefresh };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and accesstoken"
    );
  }
};
// USER REGISTRATION
const registerUser = asynchandler(async (req, res) => {
  //getting user details
  const { fullName, email, username, password } = req.body;
  // console.log(`email : ${email} full name : ${fullName}`);

  if (
    [fullName, password, username, email].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields required ");
  }

  //check user already exist
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "user already exist!");
  }

  //check images uploaded or not

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(404, "avatar is required");
  }

  const avatar = await uploadCloudinary(avatarLocalPath);
  const coverImage = await uploadCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(404, "avatar is required");
  }

  //create entry in database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  //remove password and refreshToken from response
  const successUserEntry = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //check user created or not
  if (!successUserEntry) {
    throw new ApiError(500, "Error while registering User!!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, successUserEntry, "User registered.."));
});

// USER LOGIN
const loginUser = asynchandler(async (req, res) => {
  //req.body to get data from user

  const { email, username, password } = req.body;

  //check on username and password
  if (!username && !email) {
    throw new ApiError(400, "username or email required");
  }

  //find user in database
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user not exist");
  }

  //password check
  const isValidPassword = await user.isPasswordCorrect(password);

  if (!isValidPassword) {
    throw new ApiError(401, "incorrect password");
  }

  //get access and refresh token

  const { userAccess, userRefresh } = await generateAccessAndRefreshToken(
    user._id
  );

  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", userAccess, options)
    .cookie("refreshToken", userRefresh, options)
    .json(
      new ApiResponse(
        200,
        {
          user: updatedUser,
          userAccess,
          userRefresh,
        },
        "user loged In Successfully"
      )
    );
});

//USER LOGOUT
const logoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged Out"));
});

//USER SESSION REFRESH
const refreshAccessToken = asynchandler(async (req, res) => {
  const comingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!comingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = Jwt.verify(
      comingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "inavlid Refresh Token");
    }

    if (comingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refrest token is not valid");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { userAccess, userRefresh } = await generateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", userAccess, options)
      .cookie("refreshToken", userRefresh, options)
      .json(
        new ApiResponse(
          200,
          { userAccess, userRefresh },
          "User Access Token Refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Inavlid refresh token");
  }
});

const changePassword = asynchandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const verifyPassword = await user.isPasswordCorrect(oldPassword);
  if (!verifyPassword) {
    throw new ApiError(401, "incorrect Password");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(401, "confirm password not matched");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password updated successfully"));
});

const getCurrentUser = asynchandler((req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"));
});

const updateUserDetails = asynchandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "please enter valid details");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { fullName, email },
    },
    { new: true }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});

const updateUserAvatar = asynchandler(async (req, res) => {
  const avatarlocalPath = req.file?.path;

  if (!avatarlocalPath) {
    throw new ApiError(400, "avatar file missing");
  }

  const newAvatar = await uploadCloudinary(avatarlocalPath);

  if (!newAvatar.url) {
    throw new ApiError(400, "error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { avatar: newAvatar.url },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "avatar updated successfully"));
});

const getUserProfile = asynchandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "user not found");
  }

  const userProfile = await User.aggregate([
    {
      $match: username?.toLowerCase(),
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "suscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "suscriber",
        as: "suscribed",
      },
    },
    {
      $addFields: {
        suscribersCount: {
          $size: "$suscribers",
        },
        suscribedCount: {
          $size: "$suscribed",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$suscribers.suscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateUserDetails,
  updateUserAvatar,
};
