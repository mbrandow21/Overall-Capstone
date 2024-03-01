import React from 'react';

import DynamicIconComponent from './DynamicIcons';

function Navbar() {

  const navBar = JSON.parse(localStorage.getItem('navBar'))

  console.log(navBar)

  return (
    <div id="main-container-side-bar" className="main-container">
      <div id="img-container">
        <h1><a href="/">@</a></h1>
      </div>
      <div id="table-selection">
        <ul>
        {navBar.map((page, i) => {
          return (
            <li key={i}>
              <a href={window.location.origin + '/' + page.Page_ID}><DynamicIconComponent iconName={page.React_Icon_Name} iconRoute={page.React_Icon_Endpoint} /><p>{page.Display_Name}</p></a>
            </li>
            );
          })}
        </ul>
      </div>
    </div>
  )
}
export default Navbar;