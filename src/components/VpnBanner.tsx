import { Box, Typography, Button, Paper } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface VpnBannerProps {
  affiliateLink?: string;
}

export default function VpnBanner({ affiliateLink = "https://nordvpn.com/" }: VpnBannerProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        p: 3,
        mb: 3,
        bgcolor: "rgba(22, 22, 22, 0.9)",
        border: "1px solid",
        borderColor: "warning.main",
        borderRadius: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow effect */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "4px",
          height: "100%",
          bgcolor: "warning.main",
          boxShadow: "0 0 15px 2px #ed6c02",
        }}
      />

      <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 2, md: 0 }, pl: 1 }}>
        <WarningAmberIcon sx={{ color: "warning.main", fontSize: 40, mr: 2 }} />
        <Box>
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold", lineHeight: 1.2 }}>
            Warning: Your Connection is Unsecured
          </Typography>
          <Typography variant="body2" sx={{ color: "grey.400", mt: 0.5 }}>
            Your ISP and government may be tracking your streaming activity. Hide your IP address and stream safely.
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        startIcon={<SecurityIcon />}
        href={affiliateLink}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          bgcolor: "#4687FF", // NordVPN blue
          color: "white",
          fontWeight: "bold",
          px: 4,
          py: 1.5,
          borderRadius: 2,
          textTransform: "none",
          minWidth: "220px",
          "&:hover": {
            bgcolor: "#2c6be5",
            transform: "scale(1.02)",
          },
          transition: "all 0.2s ease-in-out",
        }}
      >
        Protect Me With NordVPN
      </Button>
    </Paper>
  );
}
