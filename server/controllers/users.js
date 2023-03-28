import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params; // we get the id from the request parameters
    const user = await User.findById(id);

    const friends = await Promise.all(// promise.all is used to wait for all the promises to be resolved. A promise is an object that represents the eventual completion (or failure) of an asynchronous operation, and its resulting value.
      user.friends.map((id) => User.findById(id)) // we map through the friends array and we return a promise for each friend
    );

    const formattedFriends = friends.map( // we map through the friends array and we return an object with the data that we want to send to the frontend
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {// if the user already has the friend in his friends array, we remove it
      user.friends = user.friends.filter((id) => id !== friendId);// we filter the friends array and we return a new array with all the friends that don't have the id of the friend that we want to remove
      friend.friends = friend.friends.filter((id) => id !== id);// we remove the user from the friend's friends array
    } else {
      user.friends.push(friendId);// we add the friend to the user's friends array
      friend.friends.push(id);// we add the user to the friend's friends array
    }
    await user.save();// we save the user
    await friend.save();

    const friends = await Promise.all(// promise.all is used to wait for all the promises to be resolved
      user.friends.map((id) => User.findById(id)) // we map through the friends array and we return a promise for each friend
    );

    const formattedFriends = friends.map( // we map through the friends array and we return an object with the data that we want to send to the frontend
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
