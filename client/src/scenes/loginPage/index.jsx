import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme(); // useTheme is a hook that returns the theme object
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)"); // useMediaQuery is a hook that returns a boolean value based on the media query passed to it
  return (
    <Box>
      <Box
        width="100%" 
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%" // padding will be 1rem on top and bottom and 6% on left and right
        // rem is a unit of measurement that is relative to the font size of the root element
        // % is a unit of measurement that is relative to the parent element
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          Sociopedia
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem" // padding will be 2rem on all sides
        m="2rem auto"// margin will be 2rem on top and bottom and auto on left and right
        // auto is a value that will center the element horizontally
        borderRadius="1.5rem" 
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500"
        variant="h5" // variant is a prop that is used to set the size of the text
        sx={{ mb: "1.5rem" }} // sx is a prop that is used to set the CSS of the component
        //mb is a prop that is used to set the margin bottom
        > 
        Welcome to Sociopedia, the Social Media for Sociopaths!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
