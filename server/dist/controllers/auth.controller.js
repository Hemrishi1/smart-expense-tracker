"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.refreshToken = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const token_utils_1 = require("../utils/token.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
        const user = await User_1.default.create({
            name,
            email,
            password,
        });
        if (user) {
            const { refreshToken } = (0, token_utils_1.generateTokens)(res, user._id);
            // Save refresh token to user
            user.refreshToken = refreshToken;
            await user.save();
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
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
            // Update refresh token
            user.refreshToken = refreshToken;
            await user.save();
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
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
        // Generate new tokens
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
