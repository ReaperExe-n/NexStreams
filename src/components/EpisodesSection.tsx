import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Stack,
  Divider,
  Container,
} from "@mui/material";
import { useGetSeasonDetailsQuery } from "src/store/slices/discover";
import { Season } from "src/types/Movie";
import { useGetConfigurationQuery } from "src/store/slices/configuration";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { formatMinuteToReadable } from "src/utils/common";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { useNavigate } from "react-router-dom";
import { MAIN_PATH } from "src/constant";

interface EpisodesSectionProps {
  showId: number;
  seasons: Season[];
}

export default function EpisodesSection({ showId, seasons }: EpisodesSectionProps) {
  const validSeasons = seasons.filter((s) => s.season_number > 0);
  const [selectedSeason, setSelectedSeason] = useState<number>(
    validSeasons.length > 0 ? validSeasons[0].season_number : 1
  );

  const { data: seasonDetail, isFetching } = useGetSeasonDetailsQuery(
    { id: showId, seasonNumber: selectedSeason },
    { skip: !showId || !selectedSeason }
  );

  const { data: configuration } = useGetConfigurationQuery(undefined);
  const { progressList } = useSelector((state: RootState) => state.watchProgress);
  const navigate = useNavigate();

  if (!seasons || seasons.length === 0) return null;

  return (
    <Container sx={{ py: 4, px: { xs: 2, sm: 3, md: 5 } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={700}>
          Episodes
        </Typography>
        <Select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
          size="small"
          MenuProps={{ disableScrollLock: true }}
          sx={{
            color: "text.primary",
            "& .MuiSelect-icon": { color: "text.primary" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.3)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.5)",
            },
          }}
        >
          {validSeasons.map((season) => (
            <MenuItem key={season.id} value={season.season_number}>
              {season.name}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.1)" }} />

      {isFetching ? (
        <Typography>Loading episodes...</Typography>
      ) : (
        <Stack spacing={0}>
          {seasonDetail?.episodes?.map((episode) => {
            const epProgress = progressList.find(
              (p) => p.videoId === showId && p.seasonNumber === selectedSeason && p.episodeNumber === episode.episode_number
            );
            const percentage = epProgress ? Math.min((epProgress.progressInSeconds / epProgress.totalDuration) * 100, 100) : 0;

            return (
              <Box key={episode.id}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    py: 2,
                    px: 1,
                    borderRadius: 1,
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                  alignItems="center"
                  onClick={() => navigate(`/${MAIN_PATH.watch}?id=${showId}&type=tv&s=${selectedSeason}&e=${episode.episode_number}`)}
                >
                  <Typography variant="h4" color="text.secondary" sx={{ width: 40, textAlign: "center" }}>
                    {episode.episode_number}
                  </Typography>
                  
                  <Box sx={{ position: "relative", width: 130, height: 73, flexShrink: 0, borderRadius: 1, overflow: "hidden" }}>
                    <img
                      src={`${configuration?.images.base_url}w185${episode.still_path}`}
                      alt={episode.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/130x73?text=No+Image";
                      }}
                    />
                    <PlayCircleOutlineIcon
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        fontSize: 32,
                        opacity: 0.8,
                      }}
                    />
                    {percentage > 0 && (
                      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, bgcolor: "rgba(255,255,255,0.3)" }}>
                        <Box sx={{ height: "100%", width: `${percentage}%`, bgcolor: "error.main" }} />
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight={600} noWrap>
                        {episode.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {episode.runtime ? formatMinuteToReadable(episode.runtime) : ""}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mt: 0.5,
                      }}
                    >
                      {episode.overview}
                    </Typography>
                  </Box>
                </Stack>
                <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
              </Box>
            );
          })}
        </Stack>
      )}
    </Container>
  );
}
