"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.updateUserProfile = exports.getUserProfile = exports.refreshToken = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const token_utils_1 = require("../utils/token.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const email_service_1 = require("../services/email.service");
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }
        const user = await User_1.default.create({ name, email, password });
        if (user) {
            const { refreshToken } = (0, token_utils_1.generateTokens)(res, user._id);
            user.refreshToken = refreshToken;
            await user.save();
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                age: user.age,
                gender: user.gender,
                bio: user.bio,
            });
        }
        else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.registerUser = registerUser;
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email }).select('+password');
        if (user && (await user.comparePassword(password))) {
            const { refreshToken } = (0, token_utils_1.generateTokens)(res, user._id);
            user.refreshToken = refreshToken;
            await user.save();
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                age: user.age,
                gender: user.gender,
                bio: user.bio,
            });
        }
        else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const user = await User_1.default.findOne({ refreshToken });
            if (user) {
                user.refreshToken = undefined;
                await user.save();
            }
        }
        (0, token_utils_1.clearTokens)(res);
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.logoutUser = logoutUser;
// @desc    Refresh Token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res, next) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken;
        if (!incomingRefreshToken) {
            res.status(401);
            throw new Error('Not authorized, no refresh token');
        }
        const decoded = jsonwebtoken_1.default.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User_1.default.findById(decoded.id).select('+refreshToken');
        if (!user || user.refreshToken !== incomingRefreshToken) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
        const { refreshToken: newRefreshToken } = (0, token_utils_1.generateTokens)(res, user._id);
        user.refreshToken = newRefreshToken;
        await user.save();
        res.status(200).json({ message: 'Token refreshed successfully' });
    }
    catch (error) {
        res.status(401);
        next(new Error('Not authorized, token failed'));
    }
};
exports.refreshToken = refreshToken;
// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                age: user.age,
                gender: user.gender,
                bio: user.bio,
            });
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getUserProfile = getUserProfile;
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            if (req.body.age !== undefined)
                user.age = req.body.age;
            if (req.body.gender !== undefined)
                user.gender = req.body.gender;
            if (req.body.bio !== undefined)
                user.bio = req.body.bio;
            if (req.body.avatar !== undefined)
                user.avatar = req.body.avatar;
            if (req.body.password)
                user.password = req.body.password;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                age: updatedUser.age,
                gender: updatedUser.gender,
                bio: updatedUser.bio,
            });
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserProfile = updateUserProfile;
// @desc    Forgot password - send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User_1.default.findOne({ email }).select('+resetPasswordToken +resetPasswordExpire');
        if (!user) {
            // Send success anyway to prevent email enumeration
            res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
            return;
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
        try {
            await (0, email_service_1.sendPasswordResetEmail)(user.email, resetUrl, user.name);
            res.json({ message: 'Password reset email sent! Check your inbox.' });
        }
        catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.status(500);
            throw new Error('Email could not be sent. Please check email configuration.');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const user = await User_1.default.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        }).select('+resetPasswordToken +resetPasswordExpire');
        if (!user) {
            res.status(400);
            throw new Error('Invalid or expired reset token. Please request a new one.');
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        (0, token_utils_1.clearTokens)(res);
        res.json({ message: 'Password reset successful! You can now log in.' });
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
