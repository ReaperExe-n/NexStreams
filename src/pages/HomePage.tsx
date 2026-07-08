import Stack from "@mui/material/Stack";
import { COMMON_TITLES } from "src/constant";
import HeroSection from "src/components/HeroSection";
import { genreSliceEndpoints, useGetGenresQuery } from "src/store/slices/genre";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import SliderRowForGenre from "src/components/VideoSlider";
import SliderRowForDrama from "src/components/SliderRowForDrama";
import ContinueWatchingRow from "src/components/ContinueWatchingRow";
import RecommendedRow from "src/components/RecommendedRow";
import store from "src/store";

import { useLocation } from "react-router-dom";
import { MAIN_PATH } from "src/constant";

export async function loader() {
  await store.dispatch(
    genreSliceEndpoints.getGenres.initiate(MEDIA_TYPE.Movie)
  );
  await store.dispatch(
    genreSliceEndpoints.getGenres.initiate(MEDIA_TYPE.Tv)
  );
  return null;
}
export function Component() {
  const location = useLocation();
  const mediaType = location.pathname.includes(MAIN_PATH.tvShows)
    ? MEDIA_TYPE.Tv
    : MEDIA_TYPE.Movie;

  const { data: genres, isSuccess } = useGetGenresQuery(mediaType);

  if (isSuccess && genres && genres.length > 0) {
    return (
      <Stack spacing={2}>
        <HeroSection mediaType={mediaType} />
        <RecommendedRow />
        <ContinueWatchingRow />
        {mediaType === MEDIA_TYPE.Movie && <SliderRowForDrama />}
        {[...COMMON_TITLES, ...genres].map((genre: Genre | CustomGenre) => (
          <SliderRowForGenre
            key={genre.id || genre.name}
            genre={genre}
            mediaType={mediaType}
          />
        ))}
      </Stack>
    );
  }
  return null;
}

Component.displayName = "HomePage";
