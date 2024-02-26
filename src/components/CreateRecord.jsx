import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

import Dropdown from './Dropdown';
import DropdownElement from './DropdownElement';
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
    
    let hasError = false;
    let errors = {}; // Initialize an object to track field-specific errors
  
    data.forEach(column => {
      const value = formData[column.COLUMN_NAME];
      if (column.PK !== "TRUE" && column.IS_NULLABLE === "NO" && (value === undefined || value === null || value.toString().trim() === "")) {
        errors[column.COLUMN_NAME] = `${column.COLUMN_NAME} is required.`; // Assign a specific error message
        hasError = true;
      }
      if (column.IS_NULLABLE === 'NO' && !value){
        hasError = false;
      }
    });
  
    if (hasError) {
      console.log("Validation Failed");
      // Instead of setting just a boolean, you could set the errors object to your state
      // setFormErrors(errors); // Assuming you have a state to track form errors
      setValidationError(true);
    } else {
      console.log("Validation Passed, Form Submitted");
      console.log(formData);
      postData(formData); // Your form submission function
      setValidationError(false);
      // Reset form state or redirect user as needed
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
  
          let inputField;
          switch(column.DATA_TYPE) {
            case "nvarchar":
            case "varchar":
              inputField = column.CHARACTER_MAXIMUM_LENGTH >= 254 ? 
                <textarea rows="5" className='big-text-box' maxLength={column.CHARACTER_MAXIMUM_LENGTH} onChange={e => handleChange(column.COLUMN_NAME, e.target.value)}></textarea> :
                <input type="text" maxLength={column.CHARACTER_MAXIMUM_LENGTH} onChange={e => handleChange(column.COLUMN_NAME, e.target.value)} />;
              break;
            case "int":
              inputField = column.FK ?
                <Dropdown props={column.FK} onDropdownChange={(selectedValue) => handleChange(column.COLUMN_NAME, selectedValue)} /> :
                <input type="number" onChange={e => handleChange(column.COLUMN_NAME, parseInt(e.target.value, 10))} />;
              break;
            case "bit":
              inputField = (
                <>
                  <input type="radio" name={column.COLUMN_NAME} value="Yes" onChange={e => handleChange(column.COLUMN_NAME, true)} /> Yes
                  <input type="radio" name={column.COLUMN_NAME} value="No" onChange={e => handleChange(column.COLUMN_NAME, false)} /> No
                  {column.IS_NULLABLE === "YES" && <button type="button" onClick={() => handleChange(column.COLUMN_NAME, null)}>N/A</button>}
                </>
              );
              break;
            // Handle other data types as needed
            default:
              inputField = <p>Auto Filled Info</p>; // For undefined data types or auto-filled info
              break;
          }
  
          return (
            <div key={column.COLUMN_NAME} id='create-record-label-container'>
              <div className='record-field-container'> 
                <div className='create-record-label'>
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