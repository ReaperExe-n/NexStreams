import Box, { BoxProps } from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";
import { MAIN_PATH } from "src/constant";
import Typography from "@mui/material/Typography";

export default function Logo({ sx }: BoxProps) {
  return (
    <RouterLink to={`/${MAIN_PATH.browse}`} style={{ textDecoration: "none" }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 900,
          color: "red",
          textTransform: "uppercase",
          fontFamily: "'Roboto', sans-serif",
          letterSpacing: "1px",
          display: "inline-block",
          ...sx,
        }}
      >
        NexStreams
      </Typography>
    </RouterLink>
  );
}

