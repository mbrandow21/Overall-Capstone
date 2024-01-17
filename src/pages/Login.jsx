import React, { useState } from "react";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault(); // Prevents the default form submission action

        // Sends a POST request to the '/api/login' endpoint
        fetch('http://127.0.0.1:5000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Login failed. Please check your credentials and try again.');
        });
    };

    return (
        <div id="login-form-container">
            <div id="sign-in-container">
                <h1>Sign In</h1>
            </div>
            <div id="username-container">
                <input 
                    className="input100" 
                    type="text" 
                    name="username" 
                    placeholder=" " 
                    required
                    id="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <label htmlFor="username">Username</label>
            </div>
            <div id="password-container">
                <input 
                    className="focus-input100" 
                    type="password"
                    name="password" 
                    placeholder=" " 
                    required
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <label htmlFor="password">Password</label>
            </div> 
            <div id="button-container">   
                <p id="forhelp-contacts">For help, <a href="www.contacts" id="help-contacts">contact</a> an admin</p>
                <button id="login-button" onClick={handleLogin}>Login</button> 
            </div>
        </div>
    );
};

export default Login;
