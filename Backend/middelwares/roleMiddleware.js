const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Not authorized"
                });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: "Access denied"
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