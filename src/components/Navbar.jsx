import React from 'react';
import { useParams } from 'react-router-dom';

import DynamicIconComponent from './DynamicIcons';

function Navbar() {
  let { table } = useParams();


  const navBar = JSON.parse(localStorage.getItem('navBar'))

  // console.log(navBar)

  return (
    <div id="main-container-side-bar" className="main-container">
      <div id="img-container">
        <h1><a href="/">Ap@te</a></h1>
      </div>
      <div id="table-selection">
        <ul>
        {navBar.map((page, i) => {
          const activePage = page.Page_ID === parseInt(table);
          console.log(activePage)
          console.log(page.Page_ID, table)
          return (
            <li key={i} className={activePage ? 'active' : ''}>
              <a href={window.location.origin + '/' + page.Page_ID}><DynamicIconComponent iconName={page.React_Icon_Name} iconRoute={page.React_Icon_Endpoint} /><p>{page.Display_Name}</p></a>
            </li>
            );
          })}
        </ul>
        <a className="logout-button" href="/logout"><p>Logout</p></a>
      </div>
    </div>
  )
}
export default Navbar;