import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Movie } from "src/types/Movie";
import { usePortal } from "src/providers/PortalProvider";
import { useDetailModal } from "src/providers/DetailModalProvider";
import { formatMinuteToReadable, getRandomNumber } from "src/utils/common";
import NetflixIconButton from "./NetflixIconButton";
import MaxLineTypography from "./MaxLineTypography";
import AgeLimitChip from "./AgeLimitChip";
import QualityChip from "./QualityChip";
import GenreBreadcrumbs from "./GenreBreadcrumbs";
import { useGetConfigurationQuery } from "src/store/slices/configuration";
import { useGetAppendedVideosQuery } from "src/store/slices/discover";
import { MEDIA_TYPE } from "src/types/Common";
import { useGetGenresQuery } from "src/store/slices/genre";
import { MAIN_PATH } from "src/constant";
import { useState, useEffect } from "react";

interface VideoCardModalProps {
  video: Movie;
  anchorElement: HTMLElement;
}

export default function VideoCardModal({
  video,
  anchorElement,
}: VideoCardModalProps) {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);

  const { data: configuration } = useGetConfigurationQuery(undefined);
  const { data: genres } = useGetGenresQuery(MEDIA_TYPE.Movie);
  const { data: movieDetail } = useGetAppendedVideosQuery(
    { mediaType: MEDIA_TYPE.Movie, id: video.id },
    { skip: !video }
  );

  const setPortal = usePortal();
  const rect = anchorElement.getBoundingClientRect();
  const { setDetailType } = useDetailModal();

  // Delay showing the video slightly so it doesn't flash if they quickly move past
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 600); // 600ms delay after portal opens before loading iframe
    return () => clearTimeout(timer);
  }, []);

  const trailer = movieDetail?.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  ) || movieDetail?.videos?.results?.find(v => v.site === "YouTube");

  return (
    <Card
      onPointerLeave={() => {
        setPortal(null, null);
      }}
      sx={{
        width: rect.width * 1.5,
        height: "100%",
        boxShadow: "0px 10px 30px rgba(0,0,0,0.8)",
      }}
    >
      <div
        style={{
          width: "100%",
          position: "relative",
          paddingTop: "calc(9 / 16 * 100%)",
          backgroundColor: "#000",
        }}
      >
        {/* Fallback Image - Always render behind video */}
        <img
          src={`${configuration?.images.base_url}w780${video.backdrop_path}`}
          style={{
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            objectFit: "cover",
            position: "absolute",
            backgroundPosition: "50%",
            zIndex: 0,
          }}
          alt={video.title}
        />

        {/* Video Trailer Iframe */}
        {showVideo && trailer && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&loop=1&playlist=${trailer.key}`}
            style={{
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              position: "absolute",
              border: "none",
              zIndex: 1,
              pointerEvents: "none", // Let hover events pass through to card
            }}
            allow="autoplay; encrypted-media"
            title="Trailer"
          />
        )}

        {/* Title and Controls Overlay */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end", // Align to bottom
            left: 0,
            right: 0,
            bottom: 0,
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingBottom: "8px",
            paddingTop: "40px", // space for gradient
            position: "absolute",
            zIndex: 2,
            background: "linear-gradient(to top, rgba(18,18,18,1) 0%, rgba(18,18,18,0) 100%)",
          }}
        >
          <MaxLineTypography
            maxLine={2}
            sx={{ width: "80%", fontWeight: 700, textShadow: "1px 1px 4px rgba(0,0,0,0.8)" }}
            variant="h6"
          >
            {video.title}
          </MaxLineTypography>
          <div style={{ flexGrow: 1 }} />
          <NetflixIconButton sx={{ bgcolor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.3)" }}>
            <VolumeUpIcon fontSize="small" />
          </NetflixIconButton>
        </div>
      </div>
      <CardContent sx={{ pt: 1.5, pb: "16px !important", bgcolor: "background.paper" }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1}>
            <NetflixIconButton
              sx={{ p: 0, color: "text.primary" }}
              onClick={() => navigate(`/${MAIN_PATH.watch}?id=${video.id}&type=${MEDIA_TYPE.Movie}`)}
            >
              <PlayCircleIcon sx={{ width: 40, height: 40 }} />
            </NetflixIconButton>
            <NetflixIconButton sx={{ border: "2px solid rgba(255,255,255,0.4)" }}>
              <AddIcon />
            </NetflixIconButton>
            <NetflixIconButton sx={{ border: "2px solid rgba(255,255,255,0.4)" }}>
              <ThumbUpOffAltIcon />
            </NetflixIconButton>
            <div style={{ flexGrow: 1 }} />
            <NetflixIconButton
              sx={{ border: "2px solid rgba(255,255,255,0.4)" }}
              onClick={() => {
                setDetailType({ mediaType: MEDIA_TYPE.Movie, id: video.id });
              }}
            >
              <ExpandMoreIcon />
            </NetflixIconButton>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography
              variant="subtitle2"
              sx={{ color: "success.main", fontWeight: 700 }}
            >{`${getRandomNumber(100)}% Match`}</Typography>
            <AgeLimitChip label={`${getRandomNumber(20)}+`} />
            <Typography variant="body2">{`${formatMinuteToReadable(
              getRandomNumber(180)
            )}`}</Typography>
            <QualityChip label="HD" />
          </Stack>
          {genres && (
            <GenreBreadcrumbs
              genres={genres
                .filter((genre) => video.genre_ids?.includes(genre.id))
                .map((genre) => genre.name)}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
