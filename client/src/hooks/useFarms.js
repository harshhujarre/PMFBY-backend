import { useState, useEffect, useCallback, useRef } from "react";

export const useFarms = (initialFilters = {}) => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination metadata (doesn't trigger refetch)
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    totalPages: 0,
    limit: 50,
  });

  // Use ref to prevent unnecessary re-fetches
  const isFetching = useRef(false);
  const limit = 50; // Constant limit

  useEffect(() => {
    const fetchFarms = async () => {
      // Prevent duplicate fetches
      if (isFetching.current) return;

      try {
        isFetching.current = true;
        setLoading(true);
        setError(null);

        // Construct URL based on filters
        const queryParams = new URLSearchParams();
        if (filters.district) queryParams.append("district", filters.district);
        if (filters.tehsil) queryParams.append("tehsil", filters.tehsil);
        if (filters.village) queryParams.append("village", filters.village);
        if (searchQuery) queryParams.append("search", searchQuery);
        queryParams.append("page", currentPage);
        queryParams.append("limit", limit);

        const url = `http://localhost:3000/api/farms/by-division?${queryParams.toString()}`;

        console.log("Fetching farms with URL:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setFarms(result.data);
          setPaginationMeta({
            total: result.total,
            totalPages: result.totalPages,
            limit: result.limit,
          });
        } else {
          throw new Error(result.message || "Failed to fetch farms");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching farms:", err);
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    };

    fetchFarms();
  }, [filters, currentPage, searchQuery, limit]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, []);

  const setPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => {
      if (prev < paginationMeta.totalPages) {
        return prev + 1;
      }
      return prev;
    });
  }, [paginationMeta.totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => {
      if (prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const updateSearch = useCallback((query) => {
    setSearchQuery(query);
    // Reset to page 1 when search changes
    setCurrentPage(1);
  }, []);

  return {
    farms,
    loading,
    error,
    updateFilters,
    filters,
    pagination: {
      page: currentPage,
      limit: limit,
      total: paginationMeta.total,
      totalPages: paginationMeta.totalPages,
    },
    setPage,
    nextPage,
    prevPage,
    searchQuery,
    updateSearch,
  };
};
