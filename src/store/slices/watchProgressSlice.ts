import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WatchProgress {
  videoId: string | number;
  seasonNumber?: number;
  episodeNumber?: number;
  progressInSeconds: number;
  totalDuration: number;
  mediaType: string;
  posterPath?: string;
  backdropPath?: string;
  title?: string;
  timestamp: number; // to sort by recently watched
}

interface WatchProgressState {
  progressList: WatchProgress[];
}

const loadState = (): WatchProgressState => {
  try {
    const serializedState = localStorage.getItem("nexstreams_watch_progress");
    if (serializedState === null) {
      return { progressList: [] };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { progressList: [] };
  }
};

const initialState: WatchProgressState = loadState();

export const watchProgressSlice = createSlice({
  name: "watchProgress",
  initialState,
  reducers: {
    updateProgress: (state, action: PayloadAction<WatchProgress>) => {
      const { videoId, seasonNumber, episodeNumber } = action.payload;
      const existingIndex = state.progressList.findIndex(
        (p) => p.videoId === videoId && p.seasonNumber === seasonNumber && p.episodeNumber === episodeNumber
      );

      if (existingIndex !== -1) {
        state.progressList[existingIndex] = action.payload;
      } else {
        state.progressList.push(action.payload);
      }

      // Sort by most recently watched
      state.progressList.sort((a, b) => b.timestamp - a.timestamp);

      localStorage.setItem("nexstreams_watch_progress", JSON.stringify(state));
    },
    removeProgress: (state, action: PayloadAction<string | number>) => {
      state.progressList = state.progressList.filter(
        (p) => p.videoId !== action.payload
      );
      localStorage.setItem("nexstreams_watch_progress", JSON.stringify(state));
    },
  },
});

export const { updateProgress, removeProgress } = watchProgressSlice.actions;

export default watchProgressSlice.reducer;
