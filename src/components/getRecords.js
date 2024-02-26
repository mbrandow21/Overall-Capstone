import axios from 'axios';

const getForeignKeyValue = (foreignKeyID, foreignKeyTable) => {
  const accessToken = localStorage.getItem('token');
  
  return axios({
    method: "POST",
    url: "http://localhost:5000/api/post/procedure",
    params: {
      proc: "db_api_getForeignKeyValue",
      parameters: JSON.stringify({
        '@foreign_key_ID': foreignKeyID,
        '@foreign_key_table': foreignKeyTable,
      }),
    },
    headers: {
      Authorization: 'Bearer ' + accessToken,
      "Content-Type": "Application/JSON"
    },
  }).then(response => {
    if (response.data) {
      const data = response.data[0]
      return data[0].Value; // Assuming the structure of the response
    }
    throw new Error('No data');
  }).catch(error => {
    console.error("error", error);
    throw error;
  });
};

const getPagesInformation = ( pageID ) => {
  const accessToken = localStorage.getItem('token');

  return axios({
    method: "GET",
    url: "http://localhost:5000/api/get",
    params: {
      from: 'Pages',
      filter:'Pages.Page_ID = ' + pageID,
    },
    headers: {
      Authorization: 'Bearer ' + accessToken,
      "Content-Type": "Application/JSON"
    },
  }).then(response => {
    if (response.data) {
      return response.data; 
    }
    throw new Error('No data');
  }).catch(error => {
    console.error("error", error);
    throw error;
  });
}

export { getForeignKeyValue, getPagesInformation }