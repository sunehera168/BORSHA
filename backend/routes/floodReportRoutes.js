const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createFloodReport,
    getFloodReports,
    getFloodReportById,
    updateFloodReport,
    deleteFloodReport,
} = require("../controllers/floodReportController");


// ===============================
// Protected Flood Report Routes
// ===============================

// Create flood report
router.post(
    "/",
    authMiddleware,
    createFloodReport
);


// Get all flood reports
router.get(
    "/",
    authMiddleware,
    getFloodReports
);


// Get single flood report
router.get(
    "/:id",
    authMiddleware,
    getFloodReportById
);


// Update flood report
router.put(
    "/:id",
    authMiddleware,
    updateFloodReport
);


// Delete flood report
router.delete(
    "/:id",
    authMiddleware,
    deleteFloodReport
);


// ===============================
// Export Router
// ===============================

module.exports = router;