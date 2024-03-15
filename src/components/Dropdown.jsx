import React, { useState, useEffect } from 'react'
import axios from 'axios'

const getDropdown = ( props, accessToken ) => {
  if (props) {
    return axios({
      method: "POST",
      url: "http://localhost:5000/api/post/procedure",
      params: {
        proc: 'db_apiGetDropdowns',
        parameters: JSON.stringify({
          '@TableName': props,
        }),
      },
      headers: {
        Authorization: 'Bearer ' + accessToken,
        "Content-Type": "Application/JSON"
      },
    }).then(response => {
      if (response.data) {
        const data = response.data
        return data; // Assuming the structure of the response
      }
      throw new Error('No data');
    }).catch(error => {
      console.error("error", error);
      throw error;
    });
  };
}

const Dropdown = ( {props, onDropdownChange, currentFK} ) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Changed to manage open state
  const [ dropData, setDropData ] = useState([])
  const [ selectedRecord, setSelectedRecord ] = useState('Select a record:' || props)

  const accessToken = localStorage.getItem('token');
  
  const handleClick = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle open state
  };

  const clickRecord = (expression, PK) => {
    setSelectedRecord(expression);
    setIsDropdownOpen(false); // Close dropdown when an item is clicked
    onDropdownChange(PK);
  };

  useEffect(() => {
    if (props !== undefined) {
      const getDropdownData = async () => {
        const data = await getDropdown( props, accessToken )
        return data
      }
      getDropdownData().then(dropData => {
        const moreData = dropData[0]
        setDropData(moreData)
        if(selectedRecord === currentFK){
          const defaultExpression = moreData.find(data => (data.PK === currentFK))
          clickRecord(defaultExpression.Expression , currentFK)
        }
      })
    }
  },[ props, accessToken ])

  return (
    <div className="dropdown-container">
      <div className="dropdown-display" onClick={handleClick}>
        {selectedRecord}
      </div>
      <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
        {dropData.map(data => (
          <div key={data.PK} className="dropdown-item" onClick={() => clickRecord(data.Expression, data.PK)}>
            {data.Expression}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;