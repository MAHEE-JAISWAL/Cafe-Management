import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import path from "path";

  
dotenv.config();
// import middlewares and routes
import { ManagerRoutes } from './routes/manager.route.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();
app.use(cors({ origin: "http://localhost:3000" })); // Replace with your frontend URL
app.use(express.json());

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Object creation for routes
const manage_routes = new ManagerRoutes();

// Starter route initialize
app.use("/api/manager", manage_routes.getRouter());


app.use(errorHandler);



export default app;


