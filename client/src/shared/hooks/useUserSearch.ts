import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./useReduxHooks";
import { searchUserThunk } from "@/entities/user/api/UserApi";
import { clearSearch } from "@/entities/user/slice/userSlice";

export const useUserSearch = () => {
  const dispatch = useAppDispatch();
  const { searchResults, searchLoading, searchError } = useAppSelector(
    (state) => state.user,
  );
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      dispatch(searchUserThunk(debouncedQuery));
    } else {
      dispatch(clearSearch());
    }
  }, [debouncedQuery, dispatch]);

  return {
    query,
    setQuery,
    results: searchResults,
    loading: searchLoading,
    error: searchError,
    clearResults: () => dispatch(clearSearch()),
  };
};
