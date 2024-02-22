import React from 'react';
import { useParams } from "react-router-dom";

import DataDisplay from './DataDisplay';


function DataGrid() {
  let { table, record } = useParams();

  if(!record) return (
    <DataDisplay />
  );
  else if(record == 0) return (
    <div id="record-display-container" className='main-container'>
      <h1>Record Creation Screen</h1>
    </div>
  );
  else return (
    <div id="record-display-container" className='main-container'>
      <h1>Record Display Screen {record}</h1>
    </div>
  )
}

export default DataGrid;
