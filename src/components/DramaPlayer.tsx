import { useState, useEffect } from "react";
import { Box, Typography, Button, Stack, CircularProgress, IconButton, Drawer, Divider } from "@mui/material";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

interface DramaPlayerProps {
  title: string;
}

export default function DramaPlayer({ title }: DramaPlayerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [currentIframe, setCurrentIframe] = useState<string | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchDrama = async () => {
      try {
        setLoading(true);
        // 1. Search for drama
        const searchRes = await axios.get(`http://localhost:3001/movies/dramacool/search/${encodeURIComponent(title)}`);
        if (searchRes.data.results.length === 0) {
          setError("Drama not found on Dramacool");
          setLoading(false);
          return;
        }
        const dramaId = searchRes.data.results[0].id;
        
        // 2. Fetch info
        const infoRes = await axios.get(`http://localhost:3001/movies/dramacool/info?id=${encodeURIComponent(dramaId)}`);
        if (infoRes.data.episodes.length === 0) {
          setError("No episodes found");
          setLoading(false);
          return;
        }
        setEpisodes(infoRes.data.episodes);
        
        // 3. Play first episode
        playEpisode(infoRes.data.episodes[0].id);
      } catch (err) {
        console.error(err);
        setError("Failed to load drama");
        setLoading(false);
      }
    };
    fetchDrama();
  }, [title]);

  const playEpisode = async (episodeId: string) => {
    try {
      setActiveEpisode(episodeId);
      setLoading(true);
      const watchRes = await axios.get(`http://localhost:3001/movies/dramacool/watch?episodeId=${encodeURIComponent(episodeId)}`);
      if (watchRes.data.iframe) {
        setCurrentIframe(watchRes.data.iframe);
      } else {
        setError("No stream found for this episode");
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load stream");
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Video Player */}
      <Box sx={{ flex: 1, position: "relative", bgcolor: "black" }}>
        {loading && (
          <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <CircularProgress color="primary" />
          </Box>
        )}
        {currentIframe && (
          <iframe
            key={currentIframe}
            src={currentIframe}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        )}
      </Box>

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

      {/* Episode Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 350 },
            bgcolor: "rgba(18,18,18,0.95)",
            backdropFilter: "blur(10px)",
            color: "white",
            borderLeft: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={700}>Episodes</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
        <Box sx={{ p: 2, overflowY: "auto", flex: 1 }}>
          <Stack spacing={1}>
            {episodes.map((ep) => (
              <Button
                key={ep.id}
                variant={activeEpisode === ep.id ? "contained" : "text"}
                color="error"
                onClick={() => {
                  playEpisode(ep.id);
                  setDrawerOpen(false);
                }}
                sx={{
                  justifyContent: "flex-start",
                  color: activeEpisode === ep.id ? "white" : "text.secondary",
                  py: 1.5,
                  px: 2,
                  bgcolor: activeEpisode === ep.id ? "error.main" : "transparent",
                  "&:hover": {
                    bgcolor: activeEpisode === ep.id ? "error.dark" : "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <Typography variant="subtitle1">Episode {ep.number}</Typography>
              </Button>
            ))}
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}
