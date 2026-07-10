import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MAIN_PATH } from "src/constant";
import { Box, Typography, Select, MenuItem, Stack, CircularProgress } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Season } from "src/types/Movie";
import { useGetSeasonDetailsQuery } from "src/store/slices/discover";
import { useGetConfigurationQuery } from "src/store/slices/configuration";
import { useDispatch, useSelector } from "react-redux";
import { updateProgress } from "src/store/slices/watchProgressSlice";
import { RootState } from "src/store";
import VpnBanner from "src/components/VpnBanner";

interface TvPlayerUIProps {
  showId: number;
  seasons: Season[];
  movieDetail?: any;
  defaultSeason?: number;
  defaultEpisode?: number;
  getServerUrl: (id: string, mediaType: string, season?: number, episode?: number) => string;
  actionButtons?: React.ReactNode;
}

export default function TvPlayerUI({ showId, seasons, movieDetail, defaultSeason, defaultEpisode, getServerUrl, actionButtons }: TvPlayerUIProps) {
  const navigate = useNavigate();
  const validSeasons = seasons.filter((s) => s.season_number > 0);
  
  const selectedSeason = defaultSeason || (validSeasons.length > 0 ? validSeasons[0].season_number : 1);
  const selectedEpisode = defaultEpisode || 1;

  const { data: seasonDetail, isFetching } = useGetSeasonDetailsQuery(
    { id: showId, seasonNumber: selectedSeason },
    { skip: !showId || !selectedSeason }
  );

  const { data: configuration } = useGetConfigurationQuery(undefined);
  const dispatch = useDispatch();
  const { progressList } = useSelector((state: RootState) => state.watchProgress);

  const handleSeasonChange = (seasonNumber: number) => {
    navigate(`/${MAIN_PATH.watch}?id=${showId}&type=tv&s=${seasonNumber}&e=1`);
  };

  const handleEpisodeChange = (episodeNumber: number) => {
    navigate(`/${MAIN_PATH.watch}?id=${showId}&type=tv&s=${selectedSeason}&e=${episodeNumber}`);
  };

  useEffect(() => {
    if (!showId || !movieDetail) return;
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5; // 5 seconds
      
      const epRuntime = seasonDetail?.episodes?.find((e: any) => e.episode_number === selectedEpisode)?.runtime;
      const duration = epRuntime ? epRuntime * 60 : 2700; // 45 mins fallback

      dispatch(updateProgress({
        videoId: showId,
        seasonNumber: selectedSeason,
        episodeNumber: selectedEpisode,
        progressInSeconds: progress,
        totalDuration: duration,
        mediaType: "tv",
        posterPath: movieDetail.poster_path,
        backdropPath: movieDetail.backdrop_path,
        title: movieDetail.title || movieDetail.name,
        timestamp: Date.now()
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [showId, movieDetail, selectedSeason, selectedEpisode, dispatch, seasonDetail]);

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
        <Box sx={{ px: { xs: 2, md: 6 }, pt: 4 }}>
          <VpnBanner />
          {actionButtons}
        </Box>
      )}

      {/* Episode Selector Area */}
      <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
            Episodes
          </Typography>
          <Select
            value={selectedSeason}
            onChange={(e) => handleSeasonChange(Number(e.target.value))}
            size="small"
            MenuProps={{ disableScrollLock: true }}
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
          <Stack spacing={0}>
            {seasonDetail?.episodes?.map((episode: any) => {
              const isActive = selectedEpisode === episode.episode_number;
              const hasImage = !!episode.still_path;
              const imageUrl = hasImage
                ? `${configuration?.images.base_url}w300${episode.still_path}`
                : "https://via.placeholder.com/300x169?text=No+Image";

              const epProgress = progressList.find(p => p.videoId === showId && p.seasonNumber === selectedSeason && p.episodeNumber === episode.episode_number);
              const percentage = epProgress ? Math.min((epProgress.progressInSeconds / epProgress.totalDuration) * 100, 100) : 0;

              return (
                <Stack
                  key={episode.id}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={3}
                  onClick={() => handleEpisodeChange(episode.episode_number)}
                  sx={{
                    cursor: "pointer",
                    p: 2,
                    borderRadius: 2,
                    bgcolor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                    transition: "background-color 0.2s",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.08)",
                      "& .play-icon": { opacity: 1 },
                    },
                  }}
                >
                  {/* Episode Number */}
                  <Typography variant="h4" sx={{ color: isActive ? "white" : "grey.500", alignSelf: "center", display: { xs: "none", sm: "block" }, width: 40, textAlign: "center" }}>
                    {episode.episode_number}
                  </Typography>

                  {/* Thumbnail */}
                  <Box sx={{ position: "relative", width: { xs: "100%", sm: 200 }, flexShrink: 0, aspectRatio: "16/9", borderRadius: 1, overflow: "hidden" }}>
                    <img
                      src={imageUrl}
                      alt={episode.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    
                    {/* Dark overlay for inactive */}
                    {!isActive && (
                      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, bgcolor: "rgba(0,0,0,0.2)" }} />
                    )}

                    {/* Play Icon on Hover */}
                    <Box className="play-icon" sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0, transition: "opacity 0.2s" }}>
                      <PlayCircleOutlineIcon sx={{ fontSize: 48, color: "white", filter: "drop-shadow(0 0 4px rgba(0,0,0,0.5))" }} />
                    </Box>

                    {/* Progress Bar */}
                    {percentage > 0 && (
                      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, bgcolor: "rgba(255,255,255,0.3)" }}>
                        <Box sx={{ height: "100%", width: `${percentage}%`, bgcolor: "error.main" }} />
                      </Box>
                    )}
                  </Box>

                  {/* Info */}
                  <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ color: "white", fontWeight: isActive ? "bold" : "normal" }}>
                        {episode.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "grey.500" }}>
                        {episode.runtime ? `${episode.runtime}m` : "45m"}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: "grey.400", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {episode.overview || "No description available."}
                    </Typography>
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
