import Button, { ButtonProps } from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";
import { MAIN_PATH } from "src/constant";
import { MEDIA_TYPE } from "src/types/Common";

interface PlayButtonProps extends Omit<ButtonProps, "id"> {
  mediaType?: MEDIA_TYPE;
  id?: number;
}

export default function PlayButton({ sx, mediaType, id, ...others }: PlayButtonProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (others.onClick) {
      others.onClick(e);
    } else if (id && mediaType) {
      navigate(`/${MAIN_PATH.watch}?id=${id}&type=${mediaType}`);
    } else {
      navigate(`/${MAIN_PATH.watch}`);
    }
  };

  return (
    <Button
      color="inherit"
      variant="contained"
      startIcon={
        <PlayArrowIcon
          sx={{
            fontSize: {
              xs: "24px !important",
              sm: "32px !important",
              md: "40px !important",
            },
          }}
        />
      }
      {...others}
      sx={{
        px: { xs: 1, sm: 2 },
        py: { xs: 0.5, sm: 1 },
        fontSize: { xs: 18, sm: 24, md: 28 },
        lineHeight: 1.5,
        fontWeight: "bold",
        whiteSpace: "nowrap",
        textTransform: "capitalize",
        ...sx,
      }}
      onClick={handleClick}
    >
      Play
    </Button>
  );
}

