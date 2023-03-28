import jwt from "jsonwebtoken";

//In controllers/auth.js we set up the authentication. In middleware/auth.js we set up the authorization. The authentication is used to verify the identity of the user. The authorization is used to verify if the user has the right to access a resource.

// The verifyToken() method is used to verify the token that we are sending from the frontend. It is used to verify if the user is logged in or not.
// The way you use the verifyToken() method is to put it as a parameter in the route. For example, in the route for the login, you can put the verifyToken() method as a parameter. This way, the user will be able to access the login route only if he is logged in. It has to be used as a middleware.
export const verifyToken = async (req, res, next) => { // next is used to move to the next middleware
  // Get token from header
  try {
      let token = req.header("Authorization"); // it is used to get the token from the request header

      if (!token) {
          return res.status(403).send("Access Denied");// 403 means that the user is not authorized to access the resource
      }

      if(token.startsWith("Bearer ")) {
          token = token.slice(7, token.length).trimLeft();// we want to remove the Bearer from the token
      }

      const verified = jwt.verify(token, process.env.JWT_SECRET); // The jwt.verify() method is used to verify the token. The first parameter is the token that we are sending from the frontend. The second parameter is the secret key, which is used to sign the token.
      req.user = verified; // 
      next(); // it is used to move to the next middleware
  } catch {
      res.status(500).json( { error: err.message }) //In a real application, you should handle the errors in a better way
  }
};
