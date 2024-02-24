import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import BackButton from './BackButton';


const ViewRecord = () => {
  const accessToken = localStorage.getItem('token');
  const [data, setData] = useState([]);
  const [tableNameArr, setTableName] = useState();
  const [recordData, setRecordData] = useState();
  const [SingularName, setSingularName] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  let { table, record } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Reset error state on each attempt
      if (table && table !== 0) try {
        const response = await axios({
          method: "POST",
          url: "http://localhost:5000/api/post/procedure",
          params: {
            proc: "api_ViewTableColumns",
            parameters: JSON.stringify({
              '@PageID': table,
              '@RecordID': record,
            }),
          },
          headers: {
            Authorization: 'Bearer ' + accessToken,
            "Content-Type": "Application/JSON"
          },
        });
        setData(response.data[0] || []); // Safely default to an empty array if no data
        setTableName(response.data[2])
        setRecordData(response.data[1])

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
  }, [table, accessToken]);
  useEffect(() => {
    if(tableNameArr !== undefined){
      console.log(tableNameArr)
      setSingularName(tableNameArr[0].Singular_Name)
    }
  },[tableNameArr])


  if(isLoading) return(<div id="record-display-container" className='main-container'>Loading...</div>)
  if(error) return(<div id="record-display-container" className='main-container'>Error: {error}</div>)
  return (
    <div id="record-display-container" className='main-container'>
      <div>
        {SingularName}: #{record}
      </div>
      <div>
        <BackButton />
      </div>
      <fieldset id="selected-record-fieldset">
          {data.map(column => {
            if (column.PK === 'TRUE') return

            let label = recordData[0][column.COLUMN_NAME]

            return (
              <div id='record-label-container' key={column.COLUMN_NAME}>
                <p>{column.COLUMN_NAME}</p>
                <p>{label}</p>
              </div>
            )
          })}
      </fieldset>
    </div>
  )
}
export default ViewRecord