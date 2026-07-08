import { useState } from "react";
import { Box, Typography, Select, MenuItem, Stack, CircularProgress } from "@mui/material";
import { Season } from "src/types/Movie";
import { useGetSeasonDetailsQuery } from "src/store/slices/discover";
import { useGetConfigurationQuery } from "src/store/slices/configuration";

interface TvPlayerUIProps {
  showId: number;
  seasons: Season[];
  getServerUrl: (id: string, mediaType: string, season?: number, episode?: number) => string;
  actionButtons?: React.ReactNode;
}

export default function TvPlayerUI({ showId, seasons, getServerUrl, actionButtons }: TvPlayerUIProps) {
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
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", bgcolor: "#0f0f0f", minHeight: "100vh" }}>
      {/* Video Player */}
      <Box sx={{ width: "100%", height: { xs: "50vh", sm: "60vh", md: "80vh" }, position: "relative", bgcolor: "black" }}>
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
      </Box>

      {/* Action Buttons passed from WatchPage */}
      {actionButtons && (
        <Box sx={{ px: { xs: 2, md: 6 }, pt: 2 }}>
          {actionButtons}
        </Box>
      )}

      {/* Episode Selector Area */}
      <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <Typography variant="h5" fontWeight={700} color="white">
            Select Season
          </Typography>
          <Select
            value={selectedSeason}
            onChange={(e) => handleSeasonChange(Number(e.target.value))}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.1)",
              color: "white",
              minWidth: 140,
              fontWeight: "bold",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
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

        {isFetching ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress color="error" />
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 3,
            }}
          >
            {seasonDetail?.episodes?.map((episode) => {
              const isActive = selectedEpisode === episode.episode_number;
              const hasImage = !!episode.still_path;
              const imageUrl = hasImage
                ? `${configuration?.images.base_url}w300${episode.still_path}`
                : "https://via.placeholder.com/300x169?text=No+Image";

              return (
                <Box
                  key={episode.id}
                  onClick={() => setSelectedEpisode(episode.episode_number)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "rgba(255,255,255,0.03)",
                    transition: "transform 0.2s, background-color 0.2s",
                    border: isActive ? "2px solid #E50914" : "2px solid transparent",
                    "&:hover": {
                      transform: "scale(1.03)",
                      bgcolor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  <Box sx={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
                    <img
                      src={imageUrl}
                      alt={episode.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: isActive ? 1 : 0.8 }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        bgcolor: "rgba(0,0,0,0.8)",
                        color: "white",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      {`${selectedSeason}x${episode.episode_number}`}
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        left: 8,
                        bgcolor: "rgba(229,9,20,0.9)",
                        color: "white",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        display: isActive ? "block" : "none",
                      }}
                    >
                      PLAYING
                    </Box>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight={isActive ? 700 : 500} color="white" noWrap>
                      {episode.episode_number}. {episode.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      {episode.runtime ? `${episode.runtime}m` : "TBA"} • {episode.air_date || "Unknown date"}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}
