import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map, // Normally you save a an object but MongoDB saves it as a Map
      of: Boolean,
      /* 
      * of is the value of the map
      * you check if the user id is in the map and the value is gonna be true if it exists
      * if you like it is gonna add the user id to the map, if you dislike it is gonna remove it
      * if you use an array you have to loop through it to check if the user id exists
      * if you use a map you can just check if the user id exists
      */
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
