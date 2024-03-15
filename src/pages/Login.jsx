import React, { useState } from "react";

import background from '../assets/FgyMountOriginal.png';

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
            // body: JSON.stringify({
            //     username: username,
            //     password: password
            // })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.token) {
                // Storing the token in localStorage or sessionStorage
                localStorage.setItem('token', data.token); // For localStorage
                // sessionStorage.setItem('token', data.token); // For sessionStorage

                window.location = '/';
            } else {
                alert('Login successful, but no token received');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Login failed. Please check your credentials and try again.');
        });
    };

    return (
        <div className="fullscreen-container">
            <div className="fullscreen-background">
                <img src={background} alt="mountain scene" />
                <div className="gradient-overlay"></div>
            </div>
            <div className="content-row">
                <div className="column">
                    <div className="welcome-card">
                        <h1>Welcome to Apate!</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate earum deserunt velit neque rem in sed placeat voluptates exercitationem provident.</p>
                    </div>
                </div>
                <div className="column login-section">
                    <form onSubmit={e=>handleLogin(e)} className="login-form">
                        <h2>Sign in</h2>
                        <div className="input-container">
                            <label htmlFor="username">Username:</label>
                            <input type="text"  id="username" value={username} onChange={e=>setUsername(e.target.value)} />
                        </div>
                        <div className="input-container">
                            <label htmlFor="password">Password:</label>
                            <input type="password"  id="password" value={password} onChange={e=>setPassword(e.target.value)} />
                        </div>
                        <div className="options-row">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Remember Me</label>
                            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Forgot Password?</a>
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
