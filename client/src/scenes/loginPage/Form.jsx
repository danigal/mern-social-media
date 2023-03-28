import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik"; // Formik is a library that is used to create forms
import * as yup from "yup"; // yup is a library that is used to validate forms
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // because we are gonna use redux for storing user info
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

// this is the validation schema will determine the shape in which the form library is going to be saving this info
const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  // this is going to be used to determine which form to show (login or register)
  // pageType is going to be the state that is going to be used to determine which form to show
  // setPageType is going to be the function that is going to be used to change the state
  // In consts you use {} for objects and [] for arrays
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme(); // we get the palette from the theme, we are going to use it to change the color of the button
  const dispatch = useDispatch(); // we are going to use dispatch to dispatch the action that is going to set the user info in the redux store
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  // this is the function that is going to be used to handle the form submit
  // it is going to be passed to the formik component
  // it is going to be called when the form is submitted
  // values is an object that contains the values of the form
  // the values are gonna come from the formik component
  // onSubmitProps is an object that contains a function that is going to be used to reset the form
  const register = async (values, onSubmitProps) => {
    /*
     * normally when you submit a form the data is going to be sent as a json object as the body of the request
     * but in this case we are going to send it as a form data because we are going to send a file
     */
    const formData = new FormData(); // this allows us to send form info with image
    for (let value in values) {
      formData.append(value, values[value]); // we are appending the values to the form data
    }
    formData.append("picturePath", values.picture.name); // we are appending the picture path to the form data

    // we are sending the form data to the backend
    // fetch is a function that allows us to make http requests

    const savedUserResponse = await fetch(
      "http://localhost:5001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json(); // we are getting the response from the backend
    onSubmitProps.resetForm(); // we are resetting the form

    if (savedUser) {
      setPageType("login"); // if the user is saved we are going to change the page type to login
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:5001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // we are sending the data as a json object
      body: JSON.stringify(values), // stringify is a function that allows us to convert an object to a json object
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        // we are dispatching the action that is going to set the user info in the redux store
        setLogin({
          user: loggedIn.user, // we are passing the user info to the action (state/index.js)
          token: loggedIn.token, // we are passing the token to the action
        })
      );
      navigate("/home"); // when the user is logged in we are going to navigate to the home page
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit} // this is the function that is going to be called when the form is submitted
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister} // this is the initial values of the form
      validationSchema={isLogin ? loginSchema : registerSchema} // this is the validation schema that is going to be used to validate the form
    >
      {({
        // between the parenthesis we are going to destructure the object that is going to be passed to the function
        // this is the object that contains all the form
        // you can use this values in your components and use them to create the form
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        // we pass handleFormSubmit to the formik component so we cant use it in to your own onSubmit function
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px" // this is the same as margin
            gridTemplateColumns="repeat(4, minmax(0, 1fr))" // this is going to create 4 columns, each column is going to be as big as the content inside of it
            sx={{
              // this is going to make the div span 4 columns if is a mobile device
              // undefined means that it is going to use the default value
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField // this is the material ui component that is going to be used to create the input
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName) // this is going to return true if the user has touched the input and if there is an error
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }} // default value, if is a mobile device it is going to span 4 columns (Line 158)
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px" // this is going to make the corners rounded
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false} // this is going to allow the user to upload only one file
                    onDrop={
                      (acceptedFiles) =>
                        setFieldValue("picture", acceptedFiles[0]) // we set the value of the picture with setFieldValue because we are using dropzone
                      // we are going to use the first file that the user has uploaded
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      // this callback function is going to be called when the user drops a file
                      // getRootProps is going to return the props that we need to add to the div that is going to be the dropzone
                      // getInputProps is going to return the props that we need to add to the input
                      <Box
                        {...getRootProps()} // this is going to add the props to the div
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? ( // if there is no picture we are going to show the text "Add Picture Here"
                          <p>Add Picture Here</p>
                        ) : (
                          // if there is a picture we are going to show the name of the picture and an edit icon
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password" // so the password is not going to be shown
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth // this is going to make the button span the whole width of the parent
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main }, // this is going to change the color of the text when the user hovers over the button
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography // The link that is going to allow the user to switch between login and register
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline", // this is going to add an underline to the text
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
