const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.user || !req.user_id) {
                return res.status(401).json({
                    message: "Not authorized — please log in"
                });
            }

            const userRole = req.user.role;
            if (!userRole || !roles.includes(userRole)) {
                return res.status(403).json({
                    message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${userRole || 'unknown'}`
                });
            }

            next();
        } catch (err) {
            res.status(500).json({
                message: "Server Error"
            });
        }
    };
};

export default authorizeRoles;