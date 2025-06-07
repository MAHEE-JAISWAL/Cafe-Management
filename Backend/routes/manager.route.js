import express from "express";
import { ManagerController } from "../controllers/manager.controller.js";
import { validateDto } from "../middlewares/validateDto.js";
import { ManagerRegisterDto, ManagerLoginDto } from "../dtos/manager.dto.js";

export class ManagerRoutes{
    constructor() {
        this.router = express.Router();
        this.ManagerController = new ManagerController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(
            "/register",
            validateDto(ManagerRegisterDto),
            this.ManagerController.register
        );
        this.router.post(
            "/login",
            validateDto(ManagerLoginDto),
            this.ManagerController.login
        );
    }

    getRouter() {
        return this.router;
    }

}