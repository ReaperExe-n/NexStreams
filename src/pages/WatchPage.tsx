import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, IconButton, Button, Stack, Typography } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import DnsIcon from "@mui/icons-material/Dns";
import FlagIcon from "@mui/icons-material/Flag";
import { useGetAppendedVideosQuery } from "src/store/slices/discover";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { updateProgress } from "src/store/slices/watchProgressSlice";
import { MEDIA_TYPE } from "src/types/Common";
import DramaPlayer from "src/components/DramaPlayer";
import TvPlayerUI from "src/components/TvPlayerUI";

type ServerKey = string;

interface ServerOption {
  key: string;
  name: string;
  badge: string;
  getUrl?: (id: string, mediaType: string, season?: number, episode?: number) => string;
}

const BASE_SERVERS: ServerOption[] = [
  {
    key: "vidsrc_mov",
    name: "vidsrc.mov (Recommended)",
    badge: "Recommended",
    getUrl: (id, mediaType, season = 1, episode = 1) =>
      mediaType === "tv"
        ? `https://vidsrc.mov/embed/tv/${id}/${season}/${episode}`
        : `https://vidsrc.mov/embed/movie/${id}`,
  },
  {
    key: "vidlink",
    name: "VidLink",
    badge: "Auto-Resume",
    getUrl: (id, mediaType, season = 1, episode = 1) =>
      mediaType === "tv"
        ? `https://vidlink.pro/tv/${id}/${season}/${episode}?autoplay=false`
        : `https://vidlink.pro/movie/${id}?autoplay=false`,
  },
  {
    key: "vidsrc_fyi",
    name: "VidSrc.fyi",
    badge: "Backup",
    getUrl: (id, mediaType, season = 1, episode = 1) =>
      mediaType === "tv"
        ? `https://vidsrc.fyi/embed/tv/${id}/${season}/${episode}`
        : `https://vidsrc.fyi/embed/movie/${id}`,
  },
  {
    key: "vidrock",
    name: "VidRock",
    badge: "Backup",
    getUrl: (id, mediaType, season = 1, episode = 1) =>
      mediaType === "tv"
        ? `https://vidrock.net/embed/tv/${id}/${season}/${episode}`
        : `https://vidrock.net/embed/movie/${id}`,
  },
  {
    key: "vidnest",
    name: "Vidnest",
    badge: "Backup",
    getUrl: (id, mediaType, season = 1, episode = 1) =>
      mediaType === "tv"
        ? `https://vidnest.net/embed/tv/${id}/${season}/${episode}`
        : `https://vidnest.net/embed/movie/${id}`,
  },
  {
    key: "vidking",
    name: "VidKing",
    badge: "Backup",
    getUrl: (id, mediaType, season = 1, episode = 1) =>
      mediaType === "tv"
        ? `https://vidking.net/embed/tv/${id}/${season}/${episode}`
        : `https://vidking.net/embed/movie/${id}`,
  },
  {
    key: "vidfast",
    name: "VidFast",
    badge: "Backup",
    getUrl: (id, mediaType, season = 1, episode = 1) =>
      mediaType === "tv"
        ? `https://vidfast.net/embed/tv/${id}/${season}/${episode}`
        : `https://vidfast.net/embed/movie/${id}`,
  },
  {
    key: "vidup",
    name: "VidUp",
    badge: "Backup",
    getUrl: (id, mediaType, season = 1, episode = 1) =>
      mediaType === "tv"
        ? `https://vidup.io/embed/tv/${id}/${season}/${episode}`
        : `https://vidup.io/embed/movie/${id}`,
  },
  {
    key: "videasy",
    name: "Videasy",
    badge: "Backup",
    getUrl: (id, mediaType, season = 1, episode = 1) =>
      mediaType === "tv"
        ? `https://videasy.net/embed/tv/${id}/${season}/${episode}`
        : `https://videasy.net/embed/movie/${id}`,
  },
  {
    key: "111movies",
    name: "111Movies",
    badge: "Backup",
    getUrl: (id, mediaType, season = 1, episode = 1) =>
      mediaType === "tv"
        ? `https://111movies.com/embed/tv/${id}/${season}/${episode}`
        : `https://111movies.com/embed/movie/${id}`,
  },
  {
    key: "2embed",
    name: "2Embed",
    badge: "Stable",
    getUrl: (id, mediaType, season = 1, episode = 1) =>
      mediaType === "tv"
        ? `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`
        : `https://www.2embed.cc/embed/${id}`,
  },
  {
    key: "multiembed",
    name: "MultiEmbed",
    badge: "Multi-Server",
    getUrl: (id, mediaType, season = 1, episode = 1) =>
      mediaType === "tv"
        ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`
        : `https://multiembed.mov/?video_id=${id}&tmdb=1`,
  },
  {
    key: "superflix",
    name: "SuperFlix",
    badge: "Backup",
    getUrl: (id, mediaType, season = 1, episode = 1) =>
      mediaType === "tv"
        ? `https://superflix.net/embed/tv/${id}/${season}/${episode}`
        : `https://superflix.net/embed/movie/${id}`,
  },
  {
    key: "peachify",
    name: "Peachify",
    badge: "Backup",
    getUrl: (id, mediaType, season = 1, episode = 1) =>
      mediaType === "tv"
        ? `https://peachify.com/embed/tv/${id}/${season}/${episode}`
        : `https://peachify.com/embed/movie/${id}`,
  }
];

export function Component() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const mediaType = searchParams.get("type") || "movie";
    const { progressList } = useSelector((state: RootState) => state.watchProgress);
  const matchedProgress = progressList.find((p) => p.videoId === Number(id));

  // Use URL params if present, otherwise fallback to watchProgress history, otherwise undefined
  const defaultSeason = searchParams.get("s") || (matchedProgress && matchedProgress.seasonNumber ? String(matchedProgress.seasonNumber) : undefined);
  const defaultEpisode = searchParams.get("e") || (matchedProgress && matchedProgress.episodeNumber ? String(matchedProgress.episodeNumber) : undefined);
  const [activeServer, setActiveServer] = useState<ServerKey>("vidsrc_mov");

  const { data: movieDetail } = useGetAppendedVideosQuery(
    { mediaType: mediaType as MEDIA_TYPE, id: Number(id) },
    { skip: !id }
  );

  const servers = useMemo(() => {
    const lang = movieDetail?.original_language;
    if (lang === "ko" || lang === "zh" || lang === "ja" || lang === "th") {
      return [
        BASE_SERVERS[0], // VidLink
        { key: "dramacool", name: "DramaCool", badge: "Legacy" }
      ];
    }
    return BASE_SERVERS;
  }, [movieDetail]);

  useEffect(() => {
    if (movieDetail) {
      const lang = movieDetail.original_language;
      if (lang === "ko" || lang === "zh" || lang === "ja" || lang === "th") {
        // We now keep vidlink as default even for Asian dramas since DramaCool API is down
        // setActiveServer("vidlink");
      }
    }
  }, [movieDetail]);

  // Track if this movie has been reported as broken
  const [isReported, setIsReported] = useState<boolean>(() => {
    if (!id) return false;
    try {
      const reported = JSON.parse(localStorage.getItem("reported_videos") || "[]");
      return reported.includes(Number(id));
    } catch {
      return false;
    }
  });

  const handleGoBack = () => {
    navigate("/browse");
  };

  const handleFixLag = () => {
    const currentIndex = servers.findIndex((s) => s.key === activeServer);
    const nextIndex = (currentIndex + 1) % servers.length;
    setActiveServer(servers[nextIndex].key);
  };

  const handleReportVideo = () => {
    if (!id) return;
    try {
      const reported = JSON.parse(localStorage.getItem("reported_videos") || "[]");
      const numId = Number(id);
      if (!reported.includes(numId)) {
        reported.push(numId);
        localStorage.setItem("reported_videos", JSON.stringify(reported));
      }
      setIsReported(true);
    } catch (e) {
      console.error("Failed to save report to localStorage", e);
    }
  };

  const dispatch = useDispatch();
  
  // Track time spent on page as a mock for video progress (since we use iframes)
  useEffect(() => {
    if (!id || !movieDetail) return;
    
    // Skip if we are rendering TvPlayerUI, because it handles its own progress with accurate seasons/episodes
    if (mediaType === "tv" && movieDetail?.seasons) return;
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5; // 5 seconds
      dispatch(updateProgress({
        videoId: id,
        progressInSeconds: progress,
        totalDuration: movieDetail.runtime ? movieDetail.runtime * 60 : 5400, // guess 90 mins if missing
        mediaType,
        posterPath: movieDetail.poster_path,
        backdropPath: movieDetail.backdrop_path,
        title: movieDetail.title || movieDetail.name,
        timestamp: Date.now()
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [id, movieDetail, mediaType, dispatch]);

  if (!id) {
    return null;
  }

  const currentServer = servers.find((s) => s.key === activeServer) || servers[0];
  const embedUrl = currentServer.getUrl ? currentServer.getUrl(id, mediaType) : "";
  const title = movieDetail?.title || movieDetail?.name || "";

  const actionButtons = (
    <Stack direction="row" spacing={2} sx={{ width: "100%", flexWrap: "wrap", gap: 2 }}>
      {servers.length > 1 && (
        <Button
          variant="contained"
          color="error"
          startIcon={<DnsIcon />}
          onClick={handleFixLag}
          sx={{
            borderRadius: "30px",
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            height: 48,
            bgcolor: "rgba(229, 9, 20, 0.9)",
            "&:hover": {
              bgcolor: "rgba(229, 9, 20, 1)",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          Fix Lag / Change Server
        </Button>
      )}

      <Button
        variant="outlined"
        color="error"
        startIcon={<FlagIcon />}
        onClick={handleReportVideo}
        disabled={isReported}
        sx={{
          borderRadius: "30px",
          textTransform: "none",
          bgcolor: isReported ? "rgba(244, 67, 54, 0.15)" : "transparent",
          color: isReported ? "error.main" : "white",
          borderColor: "error.main",
          borderWidth: "1.5px",
          fontWeight: "bold",
          px: 2.5,
          height: 48,
          "&:hover": {
            bgcolor: "rgba(244, 67, 54, 0.25)",
            borderColor: "error.main",
            borderWidth: "1.5px",
          },
          "&.Mui-disabled": {
            color: "rgba(244, 67, 54, 0.7)",
            borderColor: "rgba(244, 67, 54, 0.4)",
            bgcolor: "rgba(244, 67, 54, 0.08)",
          },
          transition: "all 0.2s ease",
        }}
      >
        {isReported ? "Reported Broken" : "Report Video"}
      </Button>
    </Stack>
  );

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#0f0f0f",
        zIndex: 9999,
      }}
    >
      {/* Floating Back Button */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          p: 3,
          display: "flex",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
          zIndex: 10000,
          pointerEvents: "none",
        }}
      >
        <IconButton
          onClick={handleGoBack}
          sx={{
            pointerEvents: "auto",
            bgcolor: "rgba(0, 0, 0, 0.6)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.9)",
              color: "red",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease-in-out",
            width: 48,
            height: 48,
          }}
        >
          <KeyboardBackspaceIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Box>

      {/* Movie/TV Stream Iframe, TvPlayerUI, or DramaPlayer */}
      {activeServer === "dramacool" ? (
        <Box sx={{ width: "100%", height: "100vh" }}>
          <DramaPlayer title={title} />
        </Box>
      ) : mediaType === "tv" && movieDetail?.seasons ? (
        <TvPlayerUI 
          key={`${id}-${defaultSeason}-${defaultEpisode}`}
          showId={Number(id)}
          seasons={movieDetail.seasons}
          movieDetail={movieDetail}
          defaultSeason={defaultSeason ? Number(defaultSeason) : undefined}
          defaultEpisode={defaultEpisode ? Number(defaultEpisode) : undefined}
          getServerUrl={(showId, mType, season, episode) => 
            currentServer.getUrl ? currentServer.getUrl(showId, mType, season, episode) : ""
          }
          actionButtons={actionButtons}
        />
      ) : (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", bgcolor: "#0f0f0f", minHeight: "100vh" }}>
          <Box sx={{ width: "100%", height: { xs: "50vh", sm: "60vh", md: "80vh" }, position: "relative", bgcolor: "black" }}>
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; encrypted-media"
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          </Box>
          <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
             {actionButtons}
          </Box>
        </Box>
      )}
    </Box>
  );
}

Component.displayName = "WatchPage";
