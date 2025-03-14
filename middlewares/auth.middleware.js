import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authorize = async (req, res, next) => {
    try { 
        let token;

        // Check if Authorization header exists and starts with "Bearer"
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]; 
        }

        // If no token is provided, return Unauthorized response
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" }); // Add return to stop execution
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by ID from token
        const user = await User.findById(decoded.userId);

        // If user doesn't exist, return Unauthorized response
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" }); // Add return to stop execution
        }

        req.user = user; // Attach user to request object for later use
        next(); // Call next middleware

    } catch (error) { 
        return res.status(401).json({ message: "Unauthorized", error: error.message }); // Add return to stop execution
    }
};

export default authorize;