import React, { useState } from "react";
import axios from "axios";

const Data = () => {
    const [inputData, setInputData] = useState('');

    const handleInputChange = (e) => {
        setInputData(e.target.value);
    };

    const sendDataToBackend = () => {
        axios.post('http://127.0.0.1:5000/api/postdata', { data: inputData })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error("There was an error!", error);
            });
    };

    return (
        <div>
            <h1>Hello World!</h1>
            <input type="text" id="datainput" value={inputData} onChange={handleInputChange}/>
            <button onClick={sendDataToBackend}>Send Data</button>
        </div>
    );
}

export default Data;
