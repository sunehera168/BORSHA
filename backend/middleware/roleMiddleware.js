// ===============================
// Role Middleware
// ===============================

const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {

        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({
                status: "error",
                message: "Authentication required",
            });
        }

        // Check if user's role is allowed
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: "error",
                message: "Access denied",
            });
        }

        // User has permission
        next();
    };
};

module.exports = roleMiddleware;