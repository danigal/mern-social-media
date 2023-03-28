// The routes folder contains the routes of the application. It contains the routes for the authentication of the users. Doesn't contain the route for the registration because we need to upload a picture and we are going to do that in the frontend.
import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);

export default router;
