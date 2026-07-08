import { useSearchParams } from "react-router-dom";
import { Container, Grid, Typography, Box } from "@mui/material";
import { useSearchMoviesQuery } from "src/store/slices/discover";
import VideoItemWithHover from "src/components/VideoItemWithHover";
import MainLoadingScreen from "src/components/MainLoadingScreen";
import { useMemo } from "react";

export function Component() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading } = useSearchMoviesQuery(
    { query, page: 1 },
    { skip: !query }
  );

  const reportedVideos = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("reported_videos") || "[]") as number[];
    } catch {
      return [];
    }
  }, []);

  const filteredMovies = useMemo(() => {
    if (!data?.results) return [];
    return data.results.filter(
      (movie) => !!movie.backdrop_path && !reportedVideos.includes(movie.id)
    );
  }, [data, reportedVideos]);

  if (isLoading) {
    return <MainLoadingScreen />;
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        px: { xs: "30px", sm: "60px" },
        pb: 4,
        pt: "150px",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {query ? (
        <>
          <Typography
            variant="h5"
            sx={{ color: "text.primary", mb: 4, fontWeight: 700 }}
          >
            Search results for: "{query}"
          </Typography>

          {filteredMovies.length > 0 ? (
            <Grid container spacing={2}>
              {filteredMovies.map((video, idx) => (
                <Grid
                  key={`${video.id}_${idx}`}
                  item
                  xs={6}
                  sm={3}
                  md={2}
                  sx={{ zIndex: 1 }}
                >
                  <VideoItemWithHover video={video} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ mt: 4, color: "text.secondary" }}>
              <Typography variant="body1">
                Your search for "{query}" did not find any matches.
              </Typography>
              <Typography variant="body2" sx={{ mt: 2, opacity: 0.7 }}>
                Suggestions:
              </Typography>
              <ul style={{ paddingLeft: "20px", marginTop: "8px", opacity: 0.7 }}>
                <li>Try different keywords</li>
                <li>Looking for a movie? Double-check the spelling</li>
                <li>Try searching for a genre like Action, Comedy, or Thriller</li>
              </ul>
            </Box>
          )}
        </>
      ) : (
        <Typography variant="h5" sx={{ color: "text.secondary", mt: 4 }}>
          Please enter a search query in the search box.
        </Typography>
      )}
    </Container>
  );
}

Component.displayName = "SearchPage";
