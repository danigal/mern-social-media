import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// The auth controller contains the logic for the authentication of the users. It contains the logic for the registration and the login of the users.
//In controllers/auth.js we set up the authentication. In middleware/auth.js we set up the authorization. The authentication is used to verify the identity of the user. The authorization is used to verify if the user has the right to access a resource.

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    // Destructure the request body
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt(); // it is used to generate a random string
    const passwordHash = await bcrypt.hash(password, salt); // it is used to hash the password

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save(); // it is used to save the new user in the database
    res.status(201).json(savedUser); // it is used to send a response to the frontend // 201 means that the request was successful and a new resource was created
  } catch (err) {
    res.status(500).json({ error: err.message }); // it is used to send a response to the frontend// 500 means that there was an error on the server
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body; // it is used to get the email and password from the request body
    const user = await User.findOne({ email: email }); // it is used to find the user in the database
    if (!user) return res.status(404).json({ msg: "User does not exist" }); //404 means that the resource was not found

    const isMatch = await bcrypt.compare(password, user.password); // it is used to compare the password that we are sending from the frontend with the password that we have in the database
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" }); // 400 means that the request was not successful

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // The jwt.sign() method is used to generate a token. The first parameter is the payload, which contains the data that we want to send to the frontend. The second parameter is the secret key, which is used to sign the token. The third parameter is the options, which contains the expiration time of the token.
    delete user.password;
    res.status(200).json({ token, user }); // if you put the user before the token, you will get an error, because the token is bigger than the user and it will be truncated // 200 means that the request was successful
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
