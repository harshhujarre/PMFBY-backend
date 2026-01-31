import { useState, useEffect } from "react";

export const useFarms = (location = "Kolhapur") => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/farms/location/${location}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setFarms(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch farms");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching farms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, [location]);

  return { farms, loading, error };
};
