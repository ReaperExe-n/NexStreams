import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, IconButton, Button, Stack, Typography } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import DnsIcon from "@mui/icons-material/Dns";
import FlagIcon from "@mui/icons-material/Flag";
import { useGetAppendedVideosQuery } from "src/store/slices/discover";
import { useDispatch } from "react-redux";
import { updateProgress } from "src/store/slices/watchProgressSlice";
import { MEDIA_TYPE } from "src/types/Common";
import DramaPlayer from "src/components/DramaPlayer";
import TvPlayerUI from "src/components/TvPlayerUI";

type ServerKey = "vidlink" | "cine" | "embed" | "dramacool";

interface ServerOption {
  key: ServerKey;
  name: string;
  badge: string;
  getUrl?: (id: string, mediaType: string, season?: number, episode?: number) => string;
}

const BASE_SERVERS: ServerOption[] = [
  {
    key: "vidlink",
    name: "VidLink (Primary)",
    badge: "Auto-Resume & Subs",
    getUrl: (id, mediaType, season = 1, episode = 1) =>
      mediaType === "tv"
        ? `https://vidlink.pro/tv/${id}/${season}/${episode}`
        : `https://vidlink.pro/movie/${id}`,
  },
  {
    key: "cine",
    name: "Cine.su (Backup 1)",
    badge: "High-Speed",
    getUrl: (id, mediaType, season = 1, episode = 1) =>
      mediaType === "tv"
        ? `https://cine.su/embed/tv/${id}/${season}/${episode}`
        : `https://cine.su/embed/movie/${id}`,
  },
  {
    key: "embed",
    name: "Embed.su (Backup 2)",
    badge: "Multi-Server",
    getUrl: (id, mediaType, season = 1, episode = 1) =>
      mediaType === "tv"
        ? `https://embed.su/embed/tv/${id}/${season}/${episode}`
        : `https://embed.su/embed/movie/${id}`,
  },
];

export function Component() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const mediaType = searchParams.get("type") || "movie";
  const [activeServer, setActiveServer] = useState<ServerKey>("vidlink");

  const { data: movieDetail } = useGetAppendedVideosQuery(
    { mediaType: mediaType as MEDIA_TYPE, id: Number(id) },
    { skip: !id }
  );

  const servers = useMemo(() => {
    const lang = movieDetail?.original_language;
    if (lang === "ko" || lang === "zh" || lang === "ja" || lang === "th") {
      return [{
        key: "dramacool",
        name: "Dramacool (Native)",
        badge: "Asian Drama",
      }] as ServerOption[];
    }
    return [...BASE_SERVERS];
  }, [movieDetail]);

  useEffect(() => {
    if (movieDetail) {
      const lang = movieDetail.original_language;
      if (lang === "ko" || lang === "zh" || lang === "ja" || lang === "th") {
        setActiveServer("dramacool");
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

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "black",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {/* Floating Header Bar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
          zIndex: 10000,
          pointerEvents: "none", // Let clicks pass through to the iframe below
        }}
      >
        {/* Left Actions: Back Button & Report Button */}
        <Stack direction="row" spacing={2} sx={{ pointerEvents: "auto" }}>
          {/* Back Button */}
          <IconButton
            onClick={handleGoBack}
            sx={{
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

          {/* Report Button */}
          <Button
            variant="outlined"
            color="error"
            startIcon={<FlagIcon />}
            onClick={handleReportVideo}
            disabled={isReported}
            sx={{
              borderRadius: "30px",
              textTransform: "none",
              bgcolor: isReported ? "rgba(244, 67, 54, 0.15)" : "rgba(0, 0, 0, 0.6)",
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

        {/* Server Selectors */}
        {servers.length > 1 && (
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
            pointerEvents: "auto", // Re-enable clicks for server selection buttons
            bgcolor: "rgba(18, 18, 18, 0.8)",
            p: 0.75,
            borderRadius: "30px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(12px)",
          }}
        >
          {servers.map((server) => {
            const isActive = server.key === activeServer;
            return (
              <Button
                key={server.key}
                variant={isActive ? "contained" : "text"}
                color={isActive ? "error" : "inherit"}
                onClick={() => setActiveServer(server.key)}
                size="small"
                startIcon={<DnsIcon />}
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  fontWeight: isActive ? "bold" : "normal",
                  px: 2.5,
                  py: 0.75,
                  fontSize: "0.85rem",
                  color: isActive ? "white" : "rgba(255, 255, 255, 0.75)",
                  "&:hover": {
                    bgcolor: isActive ? "error.main" : "rgba(255, 255, 255, 0.08)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Stack spacing={-0.25} alignItems="flex-start" sx={{ textAlign: "left" }}>
                  <Typography variant="body2" sx={{ fontWeight: isActive ? 700 : 500, fontSize: "0.85rem" }}>
                    {server.name}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: "0.65rem", opacity: isActive ? 0.95 : 0.6, color: "inherit" }}>
                    {server.badge}
                  </Typography>
                </Stack>
              </Button>
            );
          })}
        </Stack>
        )}
      </Box>

      {/* Movie/TV Stream Iframe, TvPlayerUI, or DramaPlayer */}
      {activeServer === "dramacool" ? (
        <DramaPlayer title={title} />
      ) : mediaType === "tv" && movieDetail?.seasons ? (
        <TvPlayerUI 
          showId={Number(id)}
          seasons={movieDetail.seasons}
          getServerUrl={(showId, mType, season, episode) => 
            currentServer.getUrl ? currentServer.getUrl(showId, mType, season, episode) : ""
          }
        />
      ) : (
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; encrypted-media"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      )}

    </Box>
  );
}

Component.displayName = "WatchPage";
