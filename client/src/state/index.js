import { createSlice } from "@reduxjs/toolkit";
// Will be stored globally, so we don't have to pass state as props to every component
// Always use toolkit with redux now
// Still better than other State Management Libraries like Recoil because Redux is proven for years and has more support

const initialState = {
  mode: "light", // Default mode is light
  user: null,
  token: null,
  posts: [], // We will store the posts in the state
};

// The slice is a collection of reducers and actions
// It is used to create a slice of the state
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      // state is the initialState
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    // If you come from Redux, Redux have the idea of you can't change the state directly,
    // you always have to replace a the object as opposed to directly modifying the state
    // Toolkit has this built in library called Immer, which is a library that allows you to directly modify the state
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => { // When we logout, we want to set the user and token to null
      state.user = null;
      state.token = null;
    },
    // This will set the friends in our local state because we need to update the friends list
    setFriends: (state, action) => { // if the user is not null, set the friends to the payload.friends
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => { // This will update the post in our local state
      const updatedPosts = state.posts.map((post) => {// Map through the posts and if the post id is the same as the payload post id, return the payload post
        if (post._id === action.payload.post._id) return action.payload.post; // if the post id matches the id of the post we are trying to update, we return the updated post
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } = authSlice.actions; // Export the actions
export default authSlice.reducer; // Export the reducer which is the function that will be called when we dispatch an action
