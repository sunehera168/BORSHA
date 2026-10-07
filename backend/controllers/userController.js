const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ===============================
// Register User
// ===============================
const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Name, email and password are required",
            });
        }

        // Validate name
        if (name.trim().length < 3) {
            return res.status(400).json({
                status: "error",
                message: "Name must be at least 3 characters long",
            });
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: "error",
                message: "Please provide a valid email address",
            });
        }

        // Validate phone
        if (phone && !/^01[3-9]\d{8}$/.test(phone)) {
            return res.status(400).json({
                status: "error",
                message:
                    "Phone number must be a valid 11-digit Bangladesh number",
            });
        }

        // Validate password
        if (password.length < 6) {
            return res.status(400).json({
                status: "error",
                message: "Password must be at least 6 characters long",
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({
            where: { email: email.toLowerCase().trim() },
        });

        if (existingUser) {
            return res.status(409).json({
                status: "error",
                message: "Email already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone || null,
            password: hashedPassword,
        });

        return res.status(201).json({
            status: "success",
            message: "User registered successfully",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Registration error:", error.message);

        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

// ===============================
// Login User
// ===============================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Email and password are required",
            });
        }

        // Find user by email
        const user = await User.findOne({
            where: {
                email: email.toLowerCase().trim(),
            },
        });

        // User not found
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password",
            });
        }

        // Compare password with hashed password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        // Wrong password
        if (!passwordMatch) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        // Successful login response
        return res.status(200).json({
            status: "success",
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

// ===============================
// Export Controllers
// ===============================
module.exports = {
    registerUser,
    loginUser,
};