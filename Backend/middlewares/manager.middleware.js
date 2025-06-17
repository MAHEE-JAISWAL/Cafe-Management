import jwt from "jsonwebtoken";
import { Manager } from "../models/manager.js";
import ResponseHandler from "../utils/apiRResponse.js";

export const managerAuth = async (req, res, next) => {
    const response = new ResponseHandler(res);
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return response.error(null, "Token missing", 401);
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const manager = await Manager.findById(decoded.userID).select("-password");
        if (!manager) {
            return response.error(null, "Manager not found", 404);
        }

        req.manager = manager; // Attach manager to the request
        next();
    } catch (err) {
        return response.error(null, err.message || "Authentication failed", 401);
    }
};

export default managerAuth;