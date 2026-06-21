import { User } from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false }) // to avoid validation as password is always required when userSchema is saved

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { username, fullName, email, password } = req.body

    if ([username, fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }


    const normalizedUsername = username.toLowerCase()
    const normalizedEmail = email.toLowerCase()

    const existingUser = await User.findOne({
        $or: [
            { username: normalizedUsername },
            { email: normalizedEmail }
        ]
    })

    if (existingUser) {
        throw new ApiError(409, "User already exists with given username or email")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email: normalizedEmail,
        password,
        username: normalizedUsername
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User created Successfully"))
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body
    if (!(username || email) || !password) {

        throw new ApiError(
            400,
            "Username/email and password are required"
        )
    }
    const normalizedUsername = username?.toLowerCase();
    const normalizedEmail = email?.toLowerCase();

    const user = await User.findOne({
        $or: [{ email: normalizedEmail }, { username: normalizedUsername }]
    })


    if (!user) {
        throw new ApiError(404, "user does not exist")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid User Credentials")
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,  // it makes the cookie modifiable only by server (by default anyone can modify)
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                refreshToken,
                accessToken
            }, "User logged in successfully")
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id
    await User.findByIdAndUpdate(userId, {
        $set: {
            refreshToken: undefined
        }
    },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User Logged Out")
        )


})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is expired or used")
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

        const options = {
            httpOnly: true,  // it makes the cookie modifiable only by server (by default anyone can modify)
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(
                200,
                { accessToken, refreshToken },
                "access token refreshed"
            ))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }


})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)

    if (!oldPassword?.trim()) {
        throw new ApiError(400, "Old password is required")
    }
    if (oldPassword === newPassword) {
        throw new ApiError(400, "Old and new passwords are same")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Password")
    }

    if (!newPassword?.trim()) {
        throw new ApiError(400, "New password is required")
    }
    user.password = newPassword
    await user.save({ validateBeforeSave: false })


    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Changed successfully"))

})


const updateAccountDetails = asyncHandler(async (req, res) => {
    const {
        fullName,
        bio,
        education,
        skills,
        github,
        linkedin,
        portfolio,
        location
    } = req.body;

    const updateFields = {};

    if (Array.isArray(skills)) {
        updateFields.skills = skills
            .map(skill => skill.trim())
            .filter(Boolean);
    }

    if (fullName !== undefined && fullName.trim()) {
        updateFields.fullName = fullName;
    }
    if (bio !== undefined) updateFields.bio = bio;
    if (education !== undefined) updateFields.education = education;
    if (github !== undefined) updateFields.github = github;
    if (linkedin !== undefined) updateFields.linkedin = linkedin;
    if (portfolio !== undefined) updateFields.portfolio = portfolio;
    if (location !== undefined) updateFields.location = location;


    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: updateFields
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Account details updated successfully"))
})


const updateEmail = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!email || !password) {
        throw new ApiError(
            400,
            "Email and password are required"
        );
    }

    const normalizedEmail = email.toLowerCase();

    if (normalizedEmail === user.email) {
        throw new ApiError(
            400,
            "New email must be different from current email"
        );
    }

    const existingMail = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id }
    });

    if (existingMail) {
        throw new ApiError(409, "Update Failed !!! Email already in use")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Update Failed !!! Incorrect password")
    }

    const updatedUser = await User.findByIdAndUpdate(user._id,
        {
            $set: {
                email: normalizedEmail
            }
        },
        {
            new: true,
            runValidators: true
        }

    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Account Email updated successfully"))

})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar?.url) {
        throw new ApiError(400, "Error while uploading on avatar")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: { avatar: avatar.url }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar updated successfully"))
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage?.url) {
        throw new ApiError(400, "Error while uploading cover image")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: { coverImage: coverImage.url }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Cover image updated successfully"))
})

const userProfile = asyncHandler(async (req, res) => {
    const { username } = req.params
    if (!username?.trim()) {
        throw new ApiError(400, "Username is required")
    }

    const profile = await User.aggregate([
        {
            $match: {
                username: username.trim().toLowerCase()
            }
        },
        {
            $project: {
                _id: 1,
                fullName: 1,
                username: 1,
                avatar: 1,
                coverImage: 1,
                bio: 1,
                skills: 1,
                education: 1,
                github: 1,
                linkedin: 1,
                portfolio: 1,
                location: 1,
                createdAt: 1
            }
        }
    ]);

    if (!profile?.length) {
        throw new ApiError(404, "Profile does not exist")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, profile[0], "Profile fetched successfully"))


})


export {
    registerUser, loginUser, logoutUser, getCurrentUser, refreshAccessToken,
    changeCurrentPassword, updateAccountDetails, updateEmail, userProfile, updateUserAvatar, updateUserCoverImage
}