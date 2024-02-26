import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import BackButton from './BackButton';

import {getForeignKeyValue} from './getRecords'

const ViewRecord = ( recordExpression ) => {
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
      // console.log(tableNameArr)
      setSingularName(tableNameArr[0].Singular_Name)
    }
  },[tableNameArr])

  useEffect(() => {
    const fetchForeignKeyValues = async () => {
      if (recordData && data) {
        // Assuming each item in 'data' knows if it's a FK and what table it points to
        const updatedDataPromises = data.map(async (column) => {
          if (column.DATA_TYPE === 'int' && column.FK) {
            // Assuming 'column' has properties 'ForeignKeyTable' and 'ForeignKeyID'
            const foreignKeyTable = column.FK;
            // Here you might need to find the actual ID to use; placeholder '1' used as an example
            const foreignKeyID = recordData[0][column.COLUMN_NAME];
            const label = await getForeignKeyValue(foreignKeyID, foreignKeyTable);
            return { ...column, label }; // Store the resolved label directly in the column object
          }
          return column;
        });
  
        // Wait for all promises to resolve
        const updatedData = await Promise.all(updatedDataPromises);

        setData(updatedData); // Update state with enriched data
      }
    };
  
    fetchForeignKeyValues();
  }, [recordData, accessToken]); // Dependencies

  // console.log(recordData)
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

            let label = recordData[0][column.COLUMN_NAME];

            if (column.DATA_TYPE === 'bit') {
              label = label ? 'Yes' : 'No';
            }
            if (column.DATA_TYPE === 'int' && column.FK){
              label = column.label
            }


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