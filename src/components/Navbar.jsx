import React, { useState, useEffect } from 'react';
import axios from 'axios';

import DynamicIconComponent from './DynamicIcons';

function Navbar() {
  const accessToken = localStorage.getItem('token');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to indicate loading initially
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:5000/api/post/procedure", // Update with your actual endpoint
        params: {
          proc: "FetchNavbar",
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
        setData(result[0]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);  
  
  if (isLoading) return <div>Loading...</div>;

  return (
    <div id="main-container-side-bar" className="main-container">
      <div id="img-container">
        <h1><a href="/">@</a></h1>
      </div>
      <div id="table-selection">
        <ul>
        {data.map((page, i) => {
          return (
            <li key={i}>
              <a href={window.location.origin + '/' + page.Page_ID}><DynamicIconComponent iconName={page.React_Icon_Name} iconRoute={page.React_Icon_Endpoint} /><p>{page.Display_Name}</p></a>
            </li>
            );
          })}
        </ul>
      </div>
    </div>
  )
}
export default Navbar;