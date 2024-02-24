import React from 'react';
import { useParams } from "react-router-dom";

import DataDisplay from './DataDisplay';
import CreateRecord from './CreateRecord';
import ViewRecord from './ViewRecord';

function DataGrid() {
  let { record } = useParams();

  if(!record) return (
    <DataDisplay />
  );
  else if(record == 0) return (
    <CreateRecord />
  );
  else return (
    <ViewRecord />
  )
}

export default DataGrid;
