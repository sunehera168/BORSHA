const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FloodReport = sequelize.define(
    "FloodReport",
    {
        // ===============================
        // Report ID
        // ===============================
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        // ===============================
        // User ID
        // ===============================
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        // ===============================
        // Location Name
        // ===============================
        location_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // ===============================
        // Flood Description
        // ===============================
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ===============================
        // Water Depth in Meters
        // ===============================
        water_depth: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },

        // ===============================
        // Flood Severity
        // ===============================
        severity: {
            type: DataTypes.ENUM(
                "low",
                "medium",
                "high",
                "critical"
            ),
            allowNull: false,
            defaultValue: "low",
        },

        // ===============================
        // Report Status
        // ===============================
        status: {
            type: DataTypes.ENUM(
                "active",
                "resolved",
                "rejected"
            ),
            allowNull: false,
            defaultValue: "active",
        },
    },
    {
        tableName: "flood_reports",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = FloodReport;