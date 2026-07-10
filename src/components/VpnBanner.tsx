import { Box, Typography, Button, Paper } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";

export default function VpnBanner() {
  // TODO: Replace with your actual VPN affiliate link (e.g., from NordVPN, ExpressVPN)
  const vpnLink = "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=PLACEHOLDER"; 

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "#1e1e1e",
        border: "1px solid #333",
        borderRadius: 2,
        p: 2,
        mb: 3,
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <SecurityIcon sx={{ color: "#4caf50", fontSize: 40 }} />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" color="white">
            Protect your privacy while streaming
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your ISP can see what you watch. Hide your IP and bypass geo-blocks with NordVPN.
          </Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        href={vpnLink}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          bgcolor: "#e50914",
          color: "white",
          whiteSpace: "nowrap",
          fontWeight: "bold",
          px: 3,
          "&:hover": { bgcolor: "#b20710" },
        }}
      >
        Get 60% Off
      </Button>
    </Paper>
  );
}
