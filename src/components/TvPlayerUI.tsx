import { useState } from "react";
import { Box, Typography, Select, MenuItem, Stack, Button, CircularProgress, IconButton, Drawer, Divider } from "@mui/material";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import CloseIcon from "@mui/icons-material/Close";
import { Season } from "src/types/Movie";
import { useGetSeasonDetailsQuery } from "src/store/slices/discover";
import { useGetConfigurationQuery } from "src/store/slices/configuration";

interface TvPlayerUIProps {
  showId: number;
  seasons: Season[];
  getServerUrl: (id: string, mediaType: string, season?: number, episode?: number) => string;
}

export default function TvPlayerUI({ showId, seasons, getServerUrl }: TvPlayerUIProps) {
  const validSeasons = seasons.filter((s) => s.season_number > 0);
  const [selectedSeason, setSelectedSeason] = useState<number>(
    validSeasons.length > 0 ? validSeasons[0].season_number : 1
  );
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: seasonDetail, isFetching } = useGetSeasonDetailsQuery(
    { id: showId, seasonNumber: selectedSeason },
    { skip: !showId || !selectedSeason }
  );

  const { data: configuration } = useGetConfigurationQuery(undefined);

  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(1); // reset to episode 1 when season changes
  };

  const currentEmbedUrl = getServerUrl(showId.toString(), "tv", selectedSeason, selectedEpisode);

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Video Player */}
      <Box sx={{ flex: 1, position: "relative", bgcolor: "black" }}>
        <iframe
          key={currentEmbedUrl}
          src={currentEmbedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; encrypted-media"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        {/* Floating Episodes Button */}
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: "absolute",
            bottom: 40,
            right: 40,
            zIndex: 10001,
            bgcolor: "rgba(0,0,0,0.6)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.3)",
            "&:hover": { bgcolor: "white", color: "black" },
            width: 56,
            height: 56,
          }}
        >
          <VideoLibraryIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Episode Selector Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 400 },
            bgcolor: "rgba(18,18,18,0.95)",
            backdropFilter: "blur(10px)",
            color: "white",
            borderLeft: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        {/* Header / Season Selector */}
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6" fontWeight={700}>Episodes</Typography>
            <Select
              value={selectedSeason}
              onChange={(e) => handleSeasonChange(Number(e.target.value))}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                color: "white",
                minWidth: 120,
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.2)" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.5)" },
                "& .MuiSvgIcon-root": { color: "white" },
              }}
            >
              {validSeasons.map((season) => (
                <MenuItem key={season.id} value={season.season_number}>
                  {season.name}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Episodes List */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 1 }}>
          {isFetching ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress color="inherit" size={30} />
            </Box>
          ) : (
            seasonDetail?.episodes?.map((episode) => {
              const isActive = selectedEpisode === episode.episode_number;
              return (
                <Button
                  key={episode.id}
                  onClick={() => {
                    setSelectedEpisode(episode.episode_number);
                    setDrawerOpen(false); // auto-close
                  }}
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    textTransform: "none",
                    color: "white",
                    p: 1.5,
                    mb: 0.5,
                    borderRadius: 2,
                    bgcolor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                    borderLeft: isActive ? "4px solid #E50914" : "4px solid transparent",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ width: 30, color: isActive ? "white" : "text.secondary", textAlign: "center" }}>
                    {episode.episode_number}
                  </Typography>
                  <Box sx={{ position: "relative", width: 120, height: 68, flexShrink: 0, mx: 2, borderRadius: 1, overflow: "hidden" }}>
                    <img
                      src={
                        episode.still_path
                          ? `${configuration?.images.base_url}w185${episode.still_path}`
                          : "https://via.placeholder.com/120x68?text=No+Image"
                      }
                      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: isActive ? 1 : 0.7 }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, textAlign: "left", overflow: "hidden" }}>
                    <Typography variant="body2" fontWeight={isActive ? 700 : 500} noWrap>
                      {episode.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                      {episode.runtime ? `${episode.runtime}m` : ""}
                    </Typography>
                  </Box>
                </Button>
              );
            })
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
