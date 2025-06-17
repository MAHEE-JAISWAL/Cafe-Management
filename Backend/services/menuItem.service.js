import { MenuItem } from "../models/menuItem.js";

export class MenuItemService {
    async createMenuItem(dto, imageUrl) {
        const menuItem = new MenuItem({
            ...dto,
            imageUrl,
        });
        return await menuItem.save();
    }

    async getAllMenuItems() {
        return await MenuItem.find();
    }

    async toggleMenuItemAvailability(itemId) {
        const menuItem = await MenuItem.findById(itemId);
        if (!menuItem) {
            throw new Error("Menu item not found.");
        }
        menuItem.available = !menuItem.available;
        return await menuItem.save();
    }

    async deleteMenuItem(itemId) {
        const menuItem = await MenuItem.findByIdAndDelete(itemId);
        if (!menuItem) {
            throw new Error("Menu item not found.");
        }
        return menuItem;
    }
}

export const MenuItemServices = new MenuItemService();