import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import Slider, { Settings } from "react-slick";
import { styled } from "@mui/material/styles";
import { useRef, useState } from "react";
import CustomNavigation from "./slick-slider/CustomNavigation";
import VideoItemWithHover from "./VideoItemWithHover";
import { ARROW_MAX_WIDTH } from "src/constant";

const RootStyle = styled("div")(() => ({
  position: "relative",
  overflow: "inherit",
}));

const StyledSlider = styled(Slider)(({ theme, padding }: { theme: any; padding: number }) => ({
  display: "flex !important",
  justifyContent: "center",
  overflow: "initial !important",
  "& > .slick-list": {
    overflow: "visible",
  },
  [theme.breakpoints.up("sm")]: {
    "& > .slick-list": {
      width: `calc(100% - ${2 * padding}px)`,
    },
    "& .slick-list > .slick-track": {
      margin: "0px !important",
    },
    "& .slick-list > .slick-track > .slick-current > div > .NetflixBox-root > .NetflixPaper-root:hover": {
      transformOrigin: "0% 50% !important",
    },
  },
  [theme.breakpoints.down("sm")]: {
    "& > .slick-list": {
      width: `calc(100% - ${padding}px)`,
    },
  },
}));

export default function RecommendedRow() {
  const { likedMovies } = useSelector((state: RootState) => state.likes);
  const sliderRef = useRef<Slider>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const theme = useTheme();

  // Do not render row if there are no liked movies
  if (likedMovies.length === 0) return null;

  const settings: Settings = {
    speed: 500,
    arrows: false,
    infinite: false,
    lazyLoad: "ondemand",
    slidesToShow: 6,
    slidesToScroll: 6,
    beforeChange: (currentIndex: number, nextIndex: number) => {
      if (currentIndex < nextIndex) {
        setActiveSlideIndex(nextIndex);
      } else if (currentIndex > nextIndex) {
        setIsEnd(false);
      }
      setActiveSlideIndex(nextIndex);
    },
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 5, slidesToScroll: 5 } },
      { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 4 } },
      { breakpoint: 900, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    ],
  };

  const handlePrevious = () => sliderRef.current?.slickPrev();
  const handleNext = () => sliderRef.current?.slickNext();

  return (
    <Box sx={{ overflow: "hidden", height: "100%", zIndex: 1, mt: 4 }}>
      <Stack spacing={2} direction="row" alignItems="center" sx={{ mb: 2, pl: { xs: "30px", sm: "60px" } }}>
        <Typography variant="h5" sx={{ display: "inline-block", fontWeight: 700 }}>
          Top Liked by Global Users
        </Typography>
      </Stack>

      <RootStyle>
        <CustomNavigation
          isEnd={isEnd}
          arrowWidth={ARROW_MAX_WIDTH}
          onNext={handleNext}
          onPrevious={handlePrevious}
          activeSlideIndex={activeSlideIndex}
        >
          <StyledSlider ref={sliderRef} {...settings} padding={ARROW_MAX_WIDTH} theme={theme}>
            {likedMovies.map((movie) => (
              <Box key={movie.id} sx={{ pr: { xs: 0.5, sm: 1 } }}>
                <VideoItemWithHover video={movie} />
              </Box>
            ))}
          </StyledSlider>
        </CustomNavigation>
      </RootStyle>
    </Box>
  );
}
