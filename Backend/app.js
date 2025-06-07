import express from 'express';
import dotenv from 'dotenv';

  
dotenv.config();
// import middlewares and routes
import { ManagerRoutes } from './routes/manager.route.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();
app.use(express.json());

// Object creation for routes
const manage_routes = new ManagerRoutes();

// Starter route initialize
app.use("/api/manager", manage_routes.getRouter());


app.use(errorHandler);



export default app;


