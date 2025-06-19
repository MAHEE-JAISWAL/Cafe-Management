export class ManagerRegisterDto {
    constructor({ email, password }) {
        this.email = email;
        this.password = password;
    }
    validate() {
        if (!this.email || !this.password) {
            throw new Error("Email and password are required");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
            throw new Error("Email should be correct");
        }
        if (this.password.length < 6) {
            throw new Error("Password must be at least 6 characters long. ");
        }
    }
}

export class ManagerLoginDto{
    constructor({ email, password }) {
        this.email = email;
        this.password = password;
    }

    validate() {
        if (!this.email || !this.password) {
            throw new Error("Email and password are required");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
            throw new Error("Email should be correct");
        }
        if (this.password.length < 6) {
            throw new Error("Password must be at least 6 characters long. ");
        }
    }
}

// My first branch 