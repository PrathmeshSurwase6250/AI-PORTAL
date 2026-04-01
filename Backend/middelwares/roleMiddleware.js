const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.user || !req.user_id) {
                return res.status(401).json({
                    message: "Not authorized — please log in"
                });
            }

            const userRole = req.user.role;
            console.log(`[AUTH DEBUG] User: ${req.user.email}, Role: ${userRole}, Required: ${roles.join(',')}`);
            if (!userRole || !roles.includes(userRole)) {
                return res.status(403).json({
                    message: `Access denied. Required role: ${roles.join(' or ')}. Your role is ${userRole || 'unknown'}.`
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