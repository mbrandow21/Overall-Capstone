import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Loading from './Loading';
import CreateRecord from './CreateRecord'

function DataDisplay({table}) {
  const accessToken = localStorage.getItem('token');
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [singularExpression, setSingularExpression] = useState('None');

  const [showCreateRecord, setShowCreateRecord] = useState(false);

  const handleButtonClick = () => {
    setShowCreateRecord(!showCreateRecord);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      setError(null); // Reset error state on each attempt
      if (table && table !== 0) try {
        const response = await axios({
          method: "POST",
          url: "http://localhost:5000/api/post/procedure",
          params: {
            proc: "api_GetTableDisplay",
            parameters: JSON.stringify({
              '@Page_ID': table,
            }),
          },
          headers: {
            Authorization: 'Bearer ' + accessToken,
            "Content-Type": "Application/JSON"
          },
        });
        setData(response.data[0] || []); // Safely default to an empty array if no data
        setSingularExpression(response.data[1] || []);
        // console.log(response)
        if (response.status === 401) {
          // Handle unauthorized access
          console.log('Unauthorized access. Redirecting to login.');
          window.location = '/login';
        }
      } catch (err) {

        setError(err.message || "An unknown error occurred"); // Properly capture and set the error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    setIsLoading(false);
  }, [table, accessToken]); // Include accessToken in dependencies if it can change

  const filteredData = searchQuery
    ? data.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : data;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Protect against cases where data might be null or empty
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  if (isLoading) return <div><Loading /></div>;
  if (error) return <div>Error: {error}</div>;

  if (!table || table === 0) return (
    <div><h1>Welcome Home</h1></div>
  ) 
  if (showCreateRecord === true) return (
    <CreateRecord table={table} backButton={handleButtonClick}/>
  )
  else return (
    <div id="record-display-container" className='main-container'>
      <div className="record-display-container">
        {singularExpression.length > 0 && singularExpression[0].Allow_New_Button === true && (
          <button onClick={handleButtonClick}>
            <h2>New {singularExpression[0].Singular_Name}</h2>
          </button>
        )}
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}>
        </input>
      </div>
      {data.length > 0 ? (
        <table>
          <thead>
            <tr>
              {headers.map(header => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} onClick={() => window.location.href = `${window.location.origin}/${table}/${row.ID}`} style={{cursor: 'pointer'}}>
                {headers.map(header => (
                  <td key={`${index}-${header}`}>{String(row[header])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No data available.</div>
      )}
    </div>
  );
  
}

export default DataDisplay;
