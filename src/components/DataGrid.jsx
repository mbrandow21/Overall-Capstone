import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import DataDisplay from './DataDisplay';
import { getPagesInformation } from './getRecords'
import ViewRecord from './ViewRecord'

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
  // return (
  //   <DataDisplay table={table}/>
  // )
  if(!record) return (
    <DataDisplay table={table}/>
  );
  else if(record === 0) return (
    <div>This isn't a record</div>
  );
  else return (
    <ViewRecord recordExpression={recordExpression}/>
  )
}

export default DataGrid;