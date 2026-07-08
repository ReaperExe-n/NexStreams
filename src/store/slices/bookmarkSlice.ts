import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "src/types/Movie";

interface BookmarkState {
  bookmarks: Movie[];
}

const loadState = (): BookmarkState => {
  try {
    const serializedState = localStorage.getItem("nexstreams_bookmarks");
    if (serializedState === null) {
      return { bookmarks: [] };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { bookmarks: [] };
  }
};

const initialState: BookmarkState = loadState();

export const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    toggleBookmark: (state, action: PayloadAction<Movie>) => {
      const existingIndex = state.bookmarks.findIndex(
        (b) => b.id === action.payload.id
      );

      if (existingIndex !== -1) {
        state.bookmarks.splice(existingIndex, 1);
      } else {
        state.bookmarks.push(action.payload);
      }

      localStorage.setItem("nexstreams_bookmarks", JSON.stringify(state));
    },
  },
});

export const { toggleBookmark } = bookmarkSlice.actions;

export default bookmarkSlice.reducer;
