import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import { Header, Navbar, DataGrid } from '../components';

const Dashboard = () => {
  const accessToken = localStorage.getItem('token');
  // Initialize navBarData from localStorage if available
  const initialNavBarData = localStorage.getItem('navBar') ? JSON.parse(localStorage.getItem('navBar')) : [];
  const [sidebarWidth, setSidebarWidth] = useState('20%');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:5000/api/post/procedure",
        params: { proc: "FetchNavbar" },
        headers: {
          Authorization: 'Bearer ' + accessToken,
          "Content-Type": "Application/JSON"
        },
      });

      if (response.status === 401) {
        console.log('Unauthorized access. Redirecting to login.');
        window.location = '/login';
        return;
      }
      
      const result = response.data;
      if (!result.error) {
        console.log(result[0]);
        return result[0]; // Ensure this is the correct structure you're expecting
      }
    } catch (error) {
      console.error('An error occurred while fetching data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialNavBarData.length) { // Fetch only if navBarData is not initialized
      fetchData().then(data => {
        if (data) {
          localStorage.setItem('navBar', JSON.stringify(data)); // Update localStorage here
        }
      });
    } else {
      setIsLoading(false); // Set loading to false if data is already available
    }
  }, [fetchData, initialNavBarData]); // Empty dependency array ensures this runs only once on mount

  const handleDrag = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    // Adjust the sidebar width based on mouse position
    const newWidth = `${Math.max(10, e.clientX / window.innerWidth * 100)}%`;
    setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    // Remove event listeners when dragging stops
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  if(isLoading) return(<Loading />)
  return (
    <div id="dashboard-page" style={{
      display: 'grid',
      gridTemplateAreas: `
        "header header header"
        "sidebar dragbar content"`,
      gridTemplateColumns: `${sidebarWidth} 5px auto`,
      height: '100vh',
      gridTemplateRows: 'auto 1fr',
    }}>
      <Header />
      <div id="sidebar" className='main-container' style={{ gridArea: 'sidebar' }}>
        <Navbar />
      </div>
      <div id="dragbar" style={{
        gridArea: 'dragbar',
        cursor: 'col-resize',
        backgroundColor: '#ccc'
      }} onMouseDown={handleDrag}></div>
      <div id="content" className='main-container' style={{ gridArea: 'content' }}>
        <DataGrid />
      </div>
    </div>
  );
}

export default Dashboard;
