import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js"; // import the functions from the users.js file
import { verifyToken } from "../middleware/auth.js"; // import the verifyToken function from the auth.js file

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser); // we grab the id from the request params and we use the verifyToken middleware to verify the token
router.get("/:id/friends", verifyToken, getUserFriends); // we grab the id from the request params and we use the verifyToken middleware to verify the token

/* UPDATE */
router.patch("/:id/friendId", verifyToken, addRemoveFriend); // patch is used to update a part of the resource
export default router;

