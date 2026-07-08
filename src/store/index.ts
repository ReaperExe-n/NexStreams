import { configureStore } from "@reduxjs/toolkit";
import { tmdbApi } from "./slices/apiSlice";
import discoverReducer from "./slices/discover";
import authReducer from "./slices/authSlice";
import watchProgressReducer from "./slices/watchProgressSlice";
import bookmarkReducer from "./slices/bookmarkSlice";
import likesReducer from "./slices/likesSlice";

const store = configureStore({
  reducer: {
    discover: discoverReducer,
    auth: authReducer,
    watchProgress: watchProgressReducer,
    bookmarks: bookmarkReducer,
    likes: likesReducer,
    [tmdbApi.reducerPath]: tmdbApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tmdbApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
