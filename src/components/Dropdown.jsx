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

const Dropdown = ( {props, onDropdownChange} ) => {
  const [ display, setDisplay ] = useState( 'none' )
  const [ dropData, setDropData ] = useState([])
  const [ selectedRecord, setSelectedRecord ] = useState(props)

  const accessToken = localStorage.getItem('token');
  
  const handleClick = () => {
    if (display === 'none') {
      setDisplay( 'block' )
    } else {
      setDisplay ( 'none' )
    }
  }

  const clickRecord = (expression, PK) => {
    setSelectedRecord(expression)
    setDisplay('none')
    onDropdownChange(PK)
  }

  useEffect(() => {
    if (props !== undefined) {
      const getDropdownData = async () => {
        const data = await getDropdown( props, accessToken )
        return data
      }
      getDropdownData().then(dropData => {
        const moreData = dropData[0]
        setDropData(moreData)
      })
    }
  },[ props, accessToken ])

  return (
    <div>
      <div onClick={handleClick}>
        {selectedRecord}
      </div>
      <div style={{display:display}}>
        {dropData.map(data => {
          return (
            <div key={data.PK} onClick={() => clickRecord(data.Expression, data.PK)}>
              {data.Expression}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dropdown