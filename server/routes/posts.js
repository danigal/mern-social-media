import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts); // get all posts
router.get("/:userId/posts", verifyToken, getUserPosts); // get all posts of a user

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost); // like a post

export default router;
