import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import BackButton from './BackButton';


const CreateRecord = () => {
  const accessToken = localStorage.getItem('token');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(false);
  const [tableNameArr, setTableName] = useState();


  let { table } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Reset error state on each attempt
      if (table && table !== 0) try {
        const response = await axios({
          method: "POST",
          url: "http://localhost:5000/api/post/procedure",
          params: {
            proc: "api_TableColumns",
            parameters: JSON.stringify({
              '@PageID': table,
            }),
          },
          headers: {
            Authorization: 'Bearer ' + accessToken,
            "Content-Type": "Application/JSON"
          },
        });
        setData(response.data[0] || []); // Safely default to an empty array if no data
        setTableName(response.data[1])
      } catch (err) {
        setError(err.message || "An unknown error occurred"); // Properly capture and set the error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    setIsLoading(false);
  }, [table, accessToken]); // Include accessToken in dependencies if it can change

  const postData = async (createRecordData) => {
    
    const tablename = tableNameArr[0].Table_Name; // Access the Table_Name property
    setIsLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:5000/api/post/createrecord", // Update with your actual endpoint
        data: {
          recordData: createRecordData,
          tablename: tablename,
        },
        headers: {
          Authorization: 'Bearer ' + accessToken,
          "Content-Type": "Application/JSON"
        },
      });
      if (response.status === 401) {
        // Handle unauthorized access
        console.log('Unauthorized access. Redirecting to login.');
        window.location = '/login';
      }

      const result = response.data;
      if (result.error) {
        setError(result.error);
      } else {
        window.location.href= '/' + table;
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  const [formData, setFormData] = useState({});

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Assume no errors initially
    let hasError = false;
  
    console.log("Form Data on Submit:", formData); // Debug: Log form data
  
    // Check each required field to ensure it's not undefined, null, or just an empty string
    data.forEach(column => {
      const value = formData[column.COLUMN_NAME];
      console.log(`Checking ${column.COLUMN_NAME}:`, value); // Debug: Log each check
  
      if (column.PK !== "TRUE" && column.IS_NULLABLE === "NO" && (value === undefined || value === null || value.toString().trim() === "")) {
        console.log(`${column.COLUMN_NAME} is required and missing`); // Debug: Log missing required field
        hasError = true;
      }
    });
  
    if (hasError) {
      console.log("Validation Failed"); // Debug: Log validation failure
      setValidationError(true);
    } else {
      console.log("Validation Passed, Form Submitted"); // Debug: Log successful validation
      console.log(formData)
      postData(formData)
      setValidationError(false);
      // Integrate with actual submission logic here
      // TODO: Replace console.log(formData) with your form submission function
    }
  };
  
  
  if(isLoading) return(<div>Loading...</div>)
  if(error) return(<div>Error: {error}</div>)
  return (
    <div id="record-display-container" className='main-container'>
      <BackButton />
      <form onSubmit={handleSubmit} id="create-record-form">
        {data.map(column => {
          if (column.PK === "TRUE") return null; // Skip primary keys

          let inputField = null;
          if (column.DATA_TYPE === "nvarchar" || column.DATA_TYPE === "varchar") {
            inputField = <input type="text" maxLength={column.CHARACTER_MAXIMUM_LENGTH} onChange={e => handleChange(column.COLUMN_NAME, e.target.value)} />;
          } else if (column.DATA_TYPE === "int") {
            inputField = <input type="number" onChange={e => handleChange(column.COLUMN_NAME, parseInt(e.target.value, 10))} />;
          } else if (column.DATA_TYPE === "bit") {
            inputField = (
              <>
                <input type="radio" name={column.COLUMN_NAME} value="Yes" onChange={e => handleChange(column.COLUMN_NAME, true)} /> Yes
                <input type="radio" name={column.COLUMN_NAME} value="No" onChange={e => handleChange(column.COLUMN_NAME, false)} /> No
                {column.IS_NULLABLE === "YES" && <button type="button" onClick={() => handleChange(column.COLUMN_NAME, null)}>N/A</button>}
              </>
            );
          } // Add more conditions for other data types as needed

          return (
            <div key={column.COLUMN_NAME} id='create-record-label-container'>
              <div className='record-field-container'> 
                <div>
                  <label>
                    {column.COLUMN_NAME}
                    {column.IS_NULLABLE === "NO" && <span style={{color: 'red'}}>*</span>}
                  </label>
                </div>
                <div>
                  {inputField}
                </div>
              </div>
            </div>
          );
        })}
        {validationError && (
        <div id='record-submit-null' style={{color: 'red', margin: '10px 0', textAlign: 'center'}}>
          Please fill out all required fields.
        </div>
      )}
        <button id="create-record-submit" type="submit">Create Record</button>
      </form>
    </div>
  );
}

export default CreateRecord 