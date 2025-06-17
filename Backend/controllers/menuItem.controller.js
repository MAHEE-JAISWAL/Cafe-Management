import { MenuItemServices } from "../services/menuItem.service.js";
import { MenuItemDto } from "../dtos/menuItem.dto.js";
import ResponseHandler from "../utils/apiRResponse.js";

export class MenuItemController {
    async createMenuItem(req, res, next) {
        console.log("Request body:", req.body);
        console.log("Uploaded file:", req.file);

        const response = new ResponseHandler(res);
        try {
            const dto = new MenuItemDto(req.body);
            dto.validate();

            const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
            if (!imageUrl) {
                return response.error(null, "Image is required.", 400);
            }

            const menuItem = await MenuItemServices.createMenuItem(dto, imageUrl);
            response.success(menuItem, "Menu item created successfully.", 201);
        } catch (error) {
            next(error);
        }
    }

    async getAllMenuItems(req, res, next) {
        const response = new ResponseHandler(res);
        try {
            const menuItems = await MenuItemServices.getAllMenuItems();
            response.success(menuItems, "Menu items fetched successfully.");
        } catch (error) {
            next(error);
        }
    }

    async toggleMenuItemAvailability(req, res, next) {
        const response = new ResponseHandler(res);
        try {
            const menuItem = await MenuItemServices.toggleMenuItemAvailability(
                req.params.id
            );
            response.success(menuItem, "Menu item availability updated.");
        } catch (error) {
            next(error);
        }
    }

    async deleteMenuItem(req, res, next) {
        const response = new ResponseHandler(res);
        try {
            const menuItem = await MenuItemServices.deleteMenuItem(req.params.id);
            response.success(menuItem, "Menu item deleted successfully.");
        } catch (error) {
            next(error);
        }
    }
}