import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
}

interface AuthState {
  user: { email: string } | null;
  activeProfile: UserProfile | null;
  profiles: UserProfile[];
}

// Helper to load state from localStorage
const loadState = (): AuthState => {
  try {
    const serializedState = localStorage.getItem("nexstreams_auth");
    if (serializedState === null) {
      return {
        user: null,
        activeProfile: null,
        profiles: [],
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      user: null,
      activeProfile: null,
      profiles: [],
    };
  }
};

const initialState: AuthState = loadState();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string }>) => {
      state.user = action.payload;
      // Default dummy profiles for any new user
      if (state.profiles.length === 0) {
        state.profiles = [
          { id: "1", name: "User 1", avatarUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" },
          { id: "2", name: "Kids", avatarUrl: "https://mir-s3-cdn-cf.behance.net/project_modules/disp/84c20033850498.56ba69ac290ea.png" },
        ];
      }
      localStorage.setItem("nexstreams_auth", JSON.stringify(state));
    },
    logout: (state) => {
      state.user = null;
      state.activeProfile = null;
      localStorage.setItem("nexstreams_auth", JSON.stringify(state));
    },
    setActiveProfile: (state, action: PayloadAction<UserProfile>) => {
      state.activeProfile = action.payload;
      localStorage.setItem("nexstreams_auth", JSON.stringify(state));
    },
    clearActiveProfile: (state) => {
      state.activeProfile = null;
      localStorage.setItem("nexstreams_auth", JSON.stringify(state));
    },
  },
});

export const { login, logout, setActiveProfile, clearActiveProfile } = authSlice.actions;

export default authSlice.reducer;
