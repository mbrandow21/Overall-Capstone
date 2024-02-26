import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import DataDisplay from './DataDisplay';
import CreateRecord from './CreateRecord';
import ViewRecord from './ViewRecord';
import { getPagesInformation } from './getRecords'

function DataGrid() {
  let { table, record } = useParams();

  const [recordExpression, setRecordExpression] = useState()

  useEffect(() => {
    if (table !== undefined && table !== 0) {
      const pageInformation = async () => {
        const data = await getPagesInformation( table )
        return data
      }
      pageInformation().then(myData => {
        setRecordExpression(myData[0].Selected_Record_Expression)
      })
    }
  },[ table ])
  if(!record) return (
    <DataDisplay />
  );
  else if(record == 0) return (
    <CreateRecord />
  );
  else return (
    <ViewRecord recordExpression={recordExpression}/>
  )
}

export default DataGrid;