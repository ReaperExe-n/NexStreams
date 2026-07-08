import { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MAIN_PATH } from "src/constant";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  display: "flex",
  alignItems: "center",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  cursor: "pointer",
  padding: theme.spacing(0, 1),
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .NetflixInputBase-input": {
    width: 0,
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.complex,
      easing: theme.transitions.easing.easeIn,
    }),
    "&:focus": {
      width: "auto",
    },
  },
}));

export default function SearchBox() {
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(query);

  // Sync state with URL parameter if it changes externally
  useEffect(() => {
    setInputValue(query);
    if (query) {
      setIsFocused(true);
    }
  }, [query]);

  const handleClickSearchIcon = () => {
    if (!isFocused) {
      searchInputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim()) {
      navigate(`/${MAIN_PATH.search}?q=${encodeURIComponent(value)}`, { replace: true });
    } else {
      navigate(`/${MAIN_PATH.browse}`);
    }
  };

  return (
    <Search
      sx={
        isFocused || inputValue ? { border: "1px solid white", backgroundColor: "black" } : {}
      }
    >
      <SearchIconWrapper onClick={handleClickSearchIcon}>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        inputRef={searchInputRef}
        placeholder="Titles, people, genres"
        value={inputValue}
        onChange={handleInputChange}
        inputProps={{
          "aria-label": "search",
          onFocus: () => {
            setIsFocused(true);
          },
          onBlur: () => {
            // Keep focused outline if there's text inside
            if (!inputValue) {
              setIsFocused(false);
            }
          },
        }}
      />
    </Search>
  );
}
