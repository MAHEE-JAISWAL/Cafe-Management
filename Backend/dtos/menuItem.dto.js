export class MenuItemDto {
    constructor({ name, description, price, category, available }) {
        this.name = name;
        this.description = description;
        this.price = Number(price); // Convert price to a number
        this.category = category;
        this.available = available === "true" || available === true; // Handle boolean conversion
    }

    validate() {
        if (!this.name || !this.price || !this.category) {
            throw new Error("Name, price, and category are required.");
        }

        if (isNaN(this.price) || this.price <= 0) {
            throw new Error("Price must be a positive number.");
        }

        if (typeof this.available !== "boolean") {
            throw new Error("Available must be a boolean value.");
        }
    }
}