import express from "express";
//import bodyParser from "body-parser"; //No longer needed
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
//path and fileURLToPath are used to get the current directory path (built-in nodejs modules)
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";//import the authRoutes from the auth.js file
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";//import the register function from the auth.js file
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
// This configurations are needed to use the import/export syntax
const __filename = fileURLToPath(import.meta.url);
//get the current file path
const __dirname = path.dirname(__filename);//get the current directory path
dotenv.config();//load the .env file
const app = express();//initialize express
app.use(express.json()); //use express json
app.use(helmet()); //use helmet, it is used to secure the app by setting various HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); //it prevents the browser from loading resources from different origins
app.use(morgan("common")); //is used to log HTTP requests
app.use(express.json({ limit: "30mb", extended: true })); //it is used to parse JSON bodies
//app.use(bodyParser.json({ limit: "30mb", extended: true })); // it is used to parse JSON bodies
app.use(express.urlencoded({ limit: "30mb", extended: true })); //it is used to parse URL-encoded bodies
//app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors()); // it is used to enable CORS with various options. 
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // it is used to serve static files
// In a real world application, you should store the files in a cloud storage service like Amazon S3, Google Cloud Storage, etc.

/* FILE STORAGE */
//it is used to store the files in the server
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) { //it is used to rename the file
    cb(null, file.originalname);//
  },
});
const upload = multer({ storage }); //it is used to upload the files

/* ROUTES WITH FILES */
//we keep this route before the authRoutes because we want to use the upload middleware only for this route
app.post("/auth/register", upload.single("picture"), register); // it is used to register a new user)
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes); // it is used to use the authRoutes, we only have to use the /auth because we already defined it in the authRoutes
app.use("/users", userRoutes); // it is used to use the userRoutes
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001; //if the port defined in the .env file doesn't work, it will use the port 6001
mongoose.set("strictQuery", false); //it is used to allow the use of the deprecated methods
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
     //User.insertMany(users);
     //Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
