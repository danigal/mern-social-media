import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false); // For mobile menu
  const dispatch = useDispatch(); // For dispatching actions
  const navigate = useNavigate(); // For navigation
  const user = useSelector((state) => state.user); // useSelector is a hook that allows you to access the state
  const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme(); // useTheme is a hook that allows you to access the theme

  // convenience variables for accessing theme colors
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primary = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`; // convenience variable
  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      {/* LOGO */}
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)" // clamp is a CSS function that allows you to set a min, max, and default value for a property
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            // This is the sx prop. It allows you to pass in CSS properties as props
            "&:hover": {
              color: primary,
              cursor: "pointer",
            },
          }}
        >
          Sociopedia
        </Typography>
        {isNonMobileScreen && ( //If the screen is non-mobile, then show the search bar
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem" // gap is a CSS property that allows you to set the gap between elements
            padding="0.1rem 1.5rem" // padding of 0.1rem on top and bottom, 1.5rem on left and right
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreen ? (
        <FlexBetween gap="2rem">
          {/* dispatch(setMode()) will change the theme mode */}
          <IconButton onClick={() => dispatch(setMode())}>
            {/* We set the icon based on the theme mode.
            fontSize represents the size of the button */}
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <Message sx={{ fontSize: "25px" }} />
          <Notifications sx={{ fontSize: "25px" }} />
          <Help sx={{ fontSize: "25px" }} />
          {/* FormControl is for a dropdown menu at the top bottom where we can see the user's that is logged in as well as the log out button*/}
          <FormControl
            variant="standard" // variant is a prop that allows you to set the style of the dropdown menu
            value={fullName}
          >
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  // The way we select within a CCS class is by using the & symbol, we target this specific MUI class and you do this by enter into the specter to search inside it and see what class you want to target
                  pr: "0.25rem", // pr is padding right
                  width: "3rem",
                },
                // :focus is a CSS pseudo-class that allows you to target the element that is currently focused
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />} // InputBase is a MUI component that allows you to set the style of the dropdown menu
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        // Is gonna show the menu icon if the screen is mobile
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreen && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10" // zIndex set the layer of the element, the higher the number the higher the layer
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box
            display="flex"
            justifyContent="flex-end" // flex-end is a CSS property that allows you to align the element to the end of the container
            p="1rem"
          >
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column" // we set the navbar to be a column
            justifyContent="center" // we center the items
            alignItems="center" // we center the items
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: "25px" }} />
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
