import { useEffect, useState } from "react";
import axios from "axios";
import { TMDB_V3_API_KEY } from "src/constant";
import SlickSlider from "src/components/slick-slider/SlickSlider";
import { PaginatedMovieResult } from "src/types/Common";
import { CustomGenre } from "src/types/Genre";

const dramaGenre: CustomGenre = { name: "Popular Dramas", apiString: "popular_dramas" };

export default function SliderRowForDrama() {
  const [data, setData] = useState<PaginatedMovieResult | null>(null);

  useEffect(() => {
    const fetchDramas = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_V3_API_KEY}&with_original_language=ko|zh|ja|th&without_genres=16&sort_by=popularity.desc`
        );
        const mappedDramas = res.data.results.map((item: any) => ({
          ...item,
          media_type: "tv",
        }));
        setData({
          page: 1,
          results: mappedDramas,
          total_pages: 1,
          total_results: mappedDramas.length,
        });
      } catch (err) {
        console.error("Failed to fetch dramas", err);
      }
    };
    fetchDramas();
  }, []);

  if (!data || data.results.length === 0) return null;

  return (
    <SlickSlider
      genre={dramaGenre}
      data={data}
      handleNext={() => {}} // No-op for now
    />
  );
}
