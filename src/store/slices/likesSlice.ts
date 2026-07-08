import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "src/types/Movie";

interface LikesState {
  likedMovies: Movie[];
}

const loadState = (): LikesState => {
  try {
    const serializedState = localStorage.getItem("nexstreams_likes");
    if (serializedState === null) {
      return { likedMovies: [] };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { likedMovies: [] };
  }
};

const initialState: LikesState = loadState();

export const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<Movie>) => {
      const existingIndex = state.likedMovies.findIndex(
        (m) => m.id === action.payload.id
      );

      if (existingIndex !== -1) {
        state.likedMovies.splice(existingIndex, 1);
      } else {
        state.likedMovies.push(action.payload);
      }

      localStorage.setItem("nexstreams_likes", JSON.stringify(state));
    },
  },
});

export const { toggleLike } = likesSlice.actions;

export default likesSlice.reducer;
