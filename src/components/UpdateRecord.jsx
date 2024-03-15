import React, { useState } from 'react';
import BackButton from './BackButton';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Dropdown from './Dropdown';

const UpdateRecord = ({ data, SingularName, record, recordData, onCancel }) => {
  const accessToken = localStorage.getItem('token');

  const { table } = useParams();
  
  // Step 1: Initialize form data state
  const [formData, setFormData] = useState(recordData[0] || {});
  const [updatedData, setUpdatedFormData] = useState({})

  // Step 2: Handle input changes
  const handleChange = (columnName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [columnName]: value,
    }));
    setUpdatedFormData((PreviousFormData) => ({
      ...PreviousFormData,
      [columnName]: value,
    }))
  };

  // Step 3: Form submission for record update
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Assuming you have a function or API endpoint to update the record
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:5000/api/post/updateRecord", // Replace with your actual update endpoint
        data: {
          recordData: updatedData,
          recordId: record, // Make sure to send the record ID as needed by your API
          tableId: table,
        },
        headers: {
          Authorization: 'Bearer ' + accessToken,
          "Content-Type": "Application/JSON",
        }
      })

      // Handle response or redirection as needed
      console.log("Record updated successfully:", response.data);
    } catch (error) {
      console.error("Failed to update record:", error);
    }
    window.location.reload();
  };

  return (
    <div id="record-display-container" className='main-container'>
      <form onSubmit={handleSubmit}>
        <div>
          {SingularName}: #{record}
        </div>
        <div>
          <BackButton />
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit">Update Record</button>
        </div>
        <fieldset id="selected-record-fieldset">
          {data.map((column) => {
            if (column.PK === "TRUE") return null; // Skip primary keys
  
            let inputField;
            const label = formData[column.COLUMN_NAME];

            switch(column.DATA_TYPE) {
              case "nvarchar":
              case "varchar":
                inputField = column.CHARACTER_MAXIMUM_LENGTH >= 254 | column.CHARACTER_MAXIMUM_LENGTH === -1 ? 
                  <textarea rows="5" className='big-text-box' maxLength={column.CHARACTER_MAXIMUM_LENGTH} onChange={e => handleChange(column.COLUMN_NAME, e.target.value)} value={label}></textarea> :
                  <input type="text" maxLength={column.CHARACTER_MAXIMUM_LENGTH} onChange={e => handleChange(column.COLUMN_NAME, e.target.value)} value={label} />;
                break;
              case "int":
                inputField = column.FK ?
                  <Dropdown currentFK={label} props={column.FK} onDropdownChange={(selectedValue) => handleChange(column.COLUMN_NAME, selectedValue)} /> :
                  <input type="number" onChange={e => handleChange(column.COLUMN_NAME, parseInt(e.target.value, 10))} />;
                break;
              case "bit":
                inputField = (
                  <>
                    <input
                      type="radio"
                      name={column.COLUMN_NAME}
                      value="Yes"
                      checked={label === 1 || label===true}
                      onChange={e => handleChange(column.COLUMN_NAME, 1)}
                    /> Yes
                    <input
                      type="radio"
                      name={column.COLUMN_NAME}
                      value="No"
                      checked={label === 0 || label===false}
                      onChange={e => handleChange(column.COLUMN_NAME, 0)}
                    /> No
                    {column.IS_NULLABLE === "YES" && (
                      <>
                        <input
                          type="radio"
                          name={column.COLUMN_NAME}
                          value="N/A"
                          checked={label === null}
                          onChange={e => handleChange(column.COLUMN_NAME, null)}
                        /> N/A
                      </>
                    )}
                  </>

                );
                break;
            }
            return (
              <div id='record-label-container' key={column.COLUMN_NAME}>
                <p>
                  {column.COLUMN_NAME}
                  {column.IS_NULLABLE === "NO" && <span style={{color: 'red'}}>*</span>}
                </p>
                {inputField}
              </div>
            );
          })}
        </fieldset>
      </form>
    </div>
  );
};

export default UpdateRecord;
