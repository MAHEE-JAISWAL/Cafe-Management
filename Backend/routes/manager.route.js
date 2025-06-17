import express from "express";
import { ManagerController } from "../controllers/manager.controller.js";
import { validateDto } from "../middlewares/validateDto.js";
import { ManagerRegisterDto, ManagerLoginDto } from "../dtos/manager.dto.js";
import managerAuth from "../middlewares/manager.middleware.js";
import { MenuItemController } from "../controllers/menuItem.controller.js";
import { upload } from "../middlewares/multer.js";

export class ManagerRoutes {
    constructor() {
        this.router = express.Router();
        this.ManagerController = new ManagerController();
        this.MenuItemController = new MenuItemController();
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
        this.router.get(
            "/profile",
            managerAuth,
            this.ManagerController.getProfile
        );

        // Menu item routes
        this.router.post(
            "/menu",
            upload.single("image"),
            this.MenuItemController.createMenuItem.bind(this.MenuItemController)
        );
        this.router.get(
            "/menu/allItems",
            
            this.MenuItemController.getAllMenuItems.bind(this.MenuItemController)
        );
        this.router.patch(
            "/menu/:id/toggle",
            managerAuth,
            this.MenuItemController.toggleMenuItemAvailability.bind(
                this.MenuItemController
            )
        );
        this.router.delete(
            "/menu/delete/:id",
            
            this.MenuItemController.deleteMenuItem.bind(this.MenuItemController)
        );
    }     

    getRouter() {
        return this.router;
    }
}