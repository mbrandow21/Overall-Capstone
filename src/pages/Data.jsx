

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataFetcher = () => {
    const accessToken = localStorage.getItem('token');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios({
        method: "GET",
        url: "http://localhost:5000/api/get", // Update with your actual endpoint
        params: {
          from: "Users",
          // select: "User_ID",
          // filter: "User_ID IS NOT NULL",
          // Add any other parameters you need for your request
        },
        headers: {
          Authorization: 'Bearer ' + accessToken,
          "Content-Type": "Application/JSON"
        },
      });

      const result = response.data;
      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <div>
          <h2>Data Fetched</h2>
          {/* Render your data here */}
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DataFetcher;
