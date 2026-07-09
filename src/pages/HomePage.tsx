import React from "react";
import Stack from "@mui/material/Stack";
import { MOVIE_COMMON_TITLES, TV_COMMON_TITLES } from "src/constant";
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
  const isBrowse = location.pathname.includes(MAIN_PATH.browse) || location.pathname === "/";
  const isTv = location.pathname.includes(MAIN_PATH.tvShows);
  const mediaType = isTv ? MEDIA_TYPE.Tv : MEDIA_TYPE.Movie;

  const { data: movieGenres } = useGetGenresQuery(MEDIA_TYPE.Movie);
  const { data: tvGenres } = useGetGenresQuery(MEDIA_TYPE.Tv);

  const genres = isTv ? tvGenres : movieGenres;
  const customGenres = isTv ? TV_COMMON_TITLES : MOVIE_COMMON_TITLES;

  if (movieGenres && tvGenres) {
    if (isBrowse) {
       // Render MIXED page
       return (
         <Stack spacing={2} sx={{ pb: 10 }}>
           <HeroSection mediaType={MEDIA_TYPE.Movie} />
           <RecommendedRow />
           <ContinueWatchingRow />
           <SliderRowForDrama />
           <SliderRowForGenre genre={MOVIE_COMMON_TITLES[0]} mediaType={MEDIA_TYPE.Movie} />
           <SliderRowForGenre genre={TV_COMMON_TITLES[0]} mediaType={MEDIA_TYPE.Tv} />
           <SliderRowForGenre genre={MOVIE_COMMON_TITLES[1]} mediaType={MEDIA_TYPE.Movie} />
           <SliderRowForGenre genre={TV_COMMON_TITLES[1]} mediaType={MEDIA_TYPE.Tv} />
           {movieGenres.slice(0, 5).map((g, i) => (
             <React.Fragment key={g.id}>
               <SliderRowForGenre genre={g} mediaType={MEDIA_TYPE.Movie} />
               {tvGenres[i] && <SliderRowForGenre genre={tvGenres[i]} mediaType={MEDIA_TYPE.Tv} />}
             </React.Fragment>
           ))}
         </Stack>
       )
    }

    // Render purely Movies or purely TV Shows
    return (
      <Stack spacing={2} sx={{ pb: 10 }}>
        <HeroSection mediaType={mediaType} />
        {mediaType === MEDIA_TYPE.Movie && <RecommendedRow />}
        <ContinueWatchingRow />
        {mediaType === MEDIA_TYPE.Movie && <SliderRowForDrama />}
        {[...customGenres, ...genres].map((genre: Genre | CustomGenre) => (
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
