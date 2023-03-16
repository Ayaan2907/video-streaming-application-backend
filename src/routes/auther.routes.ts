import express from "express";
import controller from "../controller/user.controller.js";
import decodeAuthToken from "../middleware/decodeAuthToken.js";
const authRoutes = express.Router();

// Public routes
authRoutes.post("/signup", controller.createUser);
authRoutes.post("/signin", controller.loginUser);

// Protected routes
authRoutes.get("/all-users", decodeAuthToken, controller.getAllUsers);
authRoutes.get("/user/:id", decodeAuthToken, controller.getUser);
authRoutes.put("/user/:id", decodeAuthToken, controller.updateUser);
authRoutes.delete("/user/:id", decodeAuthToken, controller.deleteUser);

export default authRoutes;
