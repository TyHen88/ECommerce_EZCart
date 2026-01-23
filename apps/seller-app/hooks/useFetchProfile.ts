import { useQuery } from "@tanstack/react-query";
import { userService } from "@/service/user.service";
import { useEffect } from "react";
import { getAuthToken } from "@/utils/auth";

const useFetchProfile = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["userInfo"],
    queryFn: userService.getUserProfile,
    enabled: false, // Don't auto-fetch, we'll trigger manually
    retry: 1,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // Check for token on mount and fetch if available
  useEffect(() => {
    const token = getAuthToken();
    if (token && !data) {
      refetch();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for session ready event to trigger profile fetch
  useEffect(() => {
    const handleSessionReady = () => {
      const token = getAuthToken();
      if (token) {
        // Small delay to ensure token is fully stored
        setTimeout(() => {
          refetch();
        }, 100);
      }
    };

    const handleSessionCleared = () => {
      // Session cleared - query will be invalidated naturally
    };

    window.addEventListener("sessionReady", handleSessionReady);
    window.addEventListener("sessionCleared", handleSessionCleared);

    return () => {
      window.removeEventListener("sessionReady", handleSessionReady);
      window.removeEventListener("sessionCleared", handleSessionCleared);
    };
  }, [refetch]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  };
};

export default useFetchProfile;
