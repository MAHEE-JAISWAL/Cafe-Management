import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Manager } from "../models/manager.js"; 
import dotenv from "dotenv";

dotenv.config();

export class ManagerService {
    async signup(dto) {
        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY is not set in environment variables because of this your token will not be generated");
        }
        const existingUser = await Manager.findOne({ email: dto.email });
        if (existingUser) throw new Error("Manager Already exists with this email");

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const manager = await Manager.create({
            email: dto.email,
            password: hashedPassword,
        });

        return this.generateToken(manager);

    }

    async login(dto) {
        const manager =await Manager.findOne({ email: dto.email });
        if (!manager) throw new Error("User is not register ");
        
        const isMatch = await bcrypt.compare(dto.password, manager.password);
        if (!isMatch) throw new Error("Invalid credentials");

        return this.generateToken(manager);
    }

    generateToken(user) {
        const payload = { userID: user._id, email: user.email };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "2d",
        });
        return {
            token,
            user: { email: user.email },
        };
    }
}

export const ManagerServices = new ManagerService();