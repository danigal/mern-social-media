import { Box } from "@mui/material";
import { styled } from "@mui/system";

// styled is a function that takes a component and returns a new component
const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: "1.5rem 1.5rem 0.75rem 1.5rem",
  backgroundColor: theme.palette.background.alt,// If you use styled component, you can pass in the theme object
  borderRadius: "0.75rem",
}));

export default WidgetWrapper;
