import { Box, Typography, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import VideoItemWithHover from "src/components/VideoItemWithHover";
import { APP_BAR_HEIGHT } from "src/constant";

export function Component() {
  const { bookmarks } = useSelector((state: RootState) => state.bookmarks);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: `${APP_BAR_HEIGHT + 40}px`,
        px: { xs: "30px", sm: "60px" },
        pb: 10,
        bgcolor: "background.default",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: "white" }}>
        My List
      </Typography>

      {bookmarks.length === 0 ? (
        <Typography variant="body1" sx={{ color: "grey.500", textAlign: "center", mt: 10 }}>
          You haven't added any titles to your list yet.
        </Typography>
      ) : (
        <Grid container spacing={1}>
          {bookmarks.map((movie) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={movie.id}>
              <VideoItemWithHover video={movie} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

Component.displayName = "MyListPage";
