import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({ // Create new post
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save(); // Save to database

    const post = await Post.find(); // Get all posts
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message }); // 409: Conflict
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });// Find all posts with userId
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params; // we get the params from the url
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);// Check if user id exists in the map

    if (isLiked) {
      post.likes.delete(userId);// Delete user id from the map
    } else {
      post.likes.set(userId, true);// Add user id to the map
    }

    const updatedPost = await Post.findByIdAndUpdate( // findByIdAndUpdate() is a mongoose method that finds a document by id, updates it, and returns the updated document.
      id,
      { likes: post.likes },// Update likes
      { new: true }// the new: true option is used to return the modified document to the then() function instead of the original.
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
