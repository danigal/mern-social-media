import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", // objectFit is a CSS property that specifies how the content of a replaced element should be resized to fit its container
         borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user" // alt is a prop that is used to describe the image
        src={`http://localhost:5001/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;
