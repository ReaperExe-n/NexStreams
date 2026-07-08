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

interface EpisodesSectionProps {
  showId: number;
  seasons: Season[];
}

export default function EpisodesSection({ showId, seasons }: EpisodesSectionProps) {
  // Filter out season 0 (usually Specials) if needed, or just select the first one.
  const validSeasons = seasons.filter((s) => s.season_number > 0);
  const [selectedSeason, setSelectedSeason] = useState<number>(
    validSeasons.length > 0 ? validSeasons[0].season_number : 1
  );

  const { data: seasonDetail, isFetching } = useGetSeasonDetailsQuery(
    { id: showId, seasonNumber: selectedSeason },
    { skip: !showId || !selectedSeason }
  );

  const { data: configuration } = useGetConfigurationQuery(undefined);

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
          sx={{
            bgcolor: "#242424",
            color: "white",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.2)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.5)",
            },
            "& .MuiSvgIcon-root": {
              color: "white",
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

      <Box>
        {isFetching ? (
          <Typography>Loading episodes...</Typography>
        ) : (
          seasonDetail?.episodes?.map((episode, index) => (
            <Box key={episode.id}>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  py: 2,
                  px: 2,
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
                alignItems="center"
              >
                <Typography variant="h4" color="text.secondary" sx={{ width: 40 }}>
                  {episode.episode_number}
                </Typography>
                
                <Box sx={{ position: "relative", width: 130, height: 73, flexShrink: 0 }}>
                  <img
                    src={`${configuration?.images.base_url}w185${episode.still_path}`}
                    alt={episode.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 4,
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
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      mt: 0.5,
                    }}
                  >
                    {episode.overview}
                  </Typography>
                </Box>
              </Stack>
              {index < seasonDetail.episodes.length - 1 && (
                <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
              )}
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
}
