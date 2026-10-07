const FloodReport = require("../models/FloodReport");


// ===============================
// Create Flood Report
// ===============================
const createFloodReport = async (req, res) => {
    try {
        const {
            location_name,
            description,
            water_depth,
            severity,
        } = req.body;

        // Check required field
        if (!location_name) {
            return res.status(400).json({
                status: "error",
                message: "Location name is required",
            });
        }

        // Validate location name
        if (location_name.trim().length < 2) {
            return res.status(400).json({
                status: "error",
                message:
                    "Location name must be at least 2 characters long",
            });
        }

        // Validate water depth
        if (water_depth !== undefined && water_depth !== null) {
            if (
                typeof water_depth !== "number" ||
                water_depth < 0
            ) {
                return res.status(400).json({
                    status: "error",
                    message:
                        "Water depth must be a positive number",
                });
            }
        }

        // Validate severity
        const allowedSeverities = [
            "low",
            "medium",
            "high",
            "critical",
        ];

        if (
            severity &&
            !allowedSeverities.includes(severity)
        ) {
            return res.status(400).json({
                status: "error",
                message:
                    "Severity must be low, medium, high or critical",
            });
        }

        // Create report
        const floodReport = await FloodReport.create({
            user_id: req.user.id,
            location_name: location_name.trim(),
            description: description
                ? description.trim()
                : null,
            water_depth:
                water_depth !== undefined
                    ? water_depth
                    : null,
            severity: severity || "low",
        });

        return res.status(201).json({
            status: "success",
            message: "Flood report created successfully",
            data: {
                id: floodReport.id,
                user_id: floodReport.user_id,
                location_name: floodReport.location_name,
                description: floodReport.description,
                water_depth: floodReport.water_depth,
                severity: floodReport.severity,
                status: floodReport.status,
                created_at: floodReport.created_at,
            },
        });
    } catch (error) {
        console.error(
            "Create flood report error:",
            error.message
        );

        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};


// ===============================
// Get All Flood Reports
// ===============================
const getFloodReports = async (req, res) => {
    try {
        const reports = await FloodReport.findAll({
            order: [["created_at", "DESC"]],
        });

        return res.status(200).json({
            status: "success",
            message: "Flood reports retrieved successfully",
            count: reports.length,
            data: reports,
        });
    } catch (error) {
        console.error(
            "Get flood reports error:",
            error.message
        );

        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};


// ===============================
// Get Single Flood Report
// ===============================
const getFloodReportById = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await FloodReport.findByPk(id);

        if (!report) {
            return res.status(404).json({
                status: "error",
                message: "Flood report not found",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Flood report retrieved successfully",
            data: report,
        });
    } catch (error) {
        console.error(
            "Get flood report error:",
            error.message
        );

        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};


// ===============================
// Update Flood Report
// ===============================
const updateFloodReport = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            location_name,
            description,
            water_depth,
            severity,
            status,
        } = req.body;

        // Find report
        const report = await FloodReport.findByPk(id);

        if (!report) {
            return res.status(404).json({
                status: "error",
                message: "Flood report not found",
            });
        }

        // ===============================
        // Permission Check
        // ===============================

        const isOwner = report.user_id === req.user.id;
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                status: "error",
                message:
                    "You are not allowed to update this report",
            });
        }

        // ===============================
        // Validate severity
        // ===============================

        const allowedSeverities = [
            "low",
            "medium",
            "high",
            "critical",
        ];

        if (
            severity &&
            !allowedSeverities.includes(severity)
        ) {
            return res.status(400).json({
                status: "error",
                message:
                    "Severity must be low, medium, high or critical",
            });
        }

        // ===============================
        // Validate status
        // ===============================

        const allowedStatuses = [
            "active",
            "resolved",
            "rejected",
        ];

        if (
            status &&
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                status: "error",
                message:
                    "Status must be active, resolved or rejected",
            });
        }

        // ===============================
        // Validate water depth
        // ===============================

        if (water_depth !== undefined && water_depth !== null) {
            if (
                typeof water_depth !== "number" ||
                water_depth < 0
            ) {
                return res.status(400).json({
                    status: "error",
                    message:
                        "Water depth must be a positive number",
                });
            }
        }

        // ===============================
        // Update fields
        // ===============================

        if (location_name !== undefined) {
            if (location_name.trim().length < 2) {
                return res.status(400).json({
                    status: "error",
                    message:
                        "Location name must be at least 2 characters long",
                });
            }

            report.location_name = location_name.trim();
        }

        if (description !== undefined) {
            report.description = description
                ? description.trim()
                : null;
        }

        if (water_depth !== undefined) {
            report.water_depth = water_depth;
        }

        if (severity !== undefined) {
            report.severity = severity;
        }

        if (status !== undefined) {
            report.status = status;
        }

        await report.save();

        return res.status(200).json({
            status: "success",
            message: "Flood report updated successfully",
            data: report,
        });
    } catch (error) {
        console.error(
            "Update flood report error:",
            error.message
        );

        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};


// ===============================
// Delete Flood Report
// ===============================
const deleteFloodReport = async (req, res) => {
    try {
        const { id } = req.params;

        // Find report
        const report = await FloodReport.findByPk(id);

        if (!report) {
            return res.status(404).json({
                status: "error",
                message: "Flood report not found",
            });
        }

        // ===============================
        // Permission Check
        // ===============================

        const isOwner = report.user_id === req.user.id;
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                status: "error",
                message:
                    "You are not allowed to delete this report",
            });
        }

        // Delete report
        await report.destroy();

        return res.status(200).json({
            status: "success",
            message: "Flood report deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete flood report error:",
            error.message
        );

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
    createFloodReport,
    getFloodReports,
    getFloodReportById,
    updateFloodReport,
    deleteFloodReport,
};