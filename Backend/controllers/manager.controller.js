import { ManagerServices } from "../services/manager.service.js";
import  ResponseHandler  from "../utils/apiRResponse.js";

export class ManagerController {
    async register(req, res, next) {
        const response = new ResponseHandler(res);
        try {
            const result = await ManagerServices.signup(req.dto);
            response.success(result, "USer Registered", 201);

        } catch(error) {
            next(error);
            
        }
    }
    async login(req, res, next) {
        const response = new ResponseHandler(res);
        try {
            const result = await ManagerServices.login(req.dto);
            response.success(result, "Login Successful", 201);

        } catch(error) {
            next(error);
            
        }
    }
}

