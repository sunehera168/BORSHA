const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


// ===============================
// Public Routes
// ===============================

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);


// ===============================
// Protected Routes
// ===============================

// Profile - any authenticated user
router.get("/profile", authMiddleware, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "You are authenticated",
        user: req.user,
    });
});


// ===============================
// User Protected Route
// ===============================

// Accessible by both user and admin
router.get(
    "/user-test",
    authMiddleware,
    roleMiddleware("user", "admin"),
    (req, res) => {
        res.status(200).json({
            status: "success",
            message: "User route accessed successfully",
            user: req.user,
        });
    }
);


// ===============================
// Admin Protected Route
// ===============================

// Accessible only by admin
router.get(
    "/admin-test",
    authMiddleware,
    roleMiddleware("admin"),
    (req, res) => {
        res.status(200).json({
            status: "success",
            message: "Admin route accessed successfully",
            user: req.user,
        });
    }
);


// ===============================
// Export Router
// ===============================

module.exports = router;