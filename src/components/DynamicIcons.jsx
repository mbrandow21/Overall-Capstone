import React from 'react';
import * as tfiIcons from 'react-icons/tfi';
import * as luIcons from "react-icons/lu";
import * as aiicons from "react-icons/ai";
import * as bsicons from "react-icons/bs";
import * as faicons from "react-icons/fa";
import * as biicons from "react-icons/bi";


const DynamicIconComponent = ({ iconName, iconRoute }) => {
  let IconComponent = luIcons['LuAlbum']
  try {
    if (iconRoute === 'react-icons/tfi'){
      IconComponent = tfiIcons[iconName];
    }
    if (iconRoute === 'react-icons/lu'){
      IconComponent = luIcons[iconName]
    }
    if (iconRoute === 'react-icons/ai'){
      IconComponent = aiicons[iconName]
    }
    if (iconRoute === 'react-icons/bs'){
      IconComponent = bsicons[iconName]
    }
    if (iconRoute === 'react-icons/fa'){
      IconComponent = faicons[iconName]
    }
    if (iconRoute === 'react-icons/bi'){
      IconComponent = biicons[iconName]
    }
  } catch (err) {
    console.log('Icon Error:', err)
    IconComponent = luIcons['LuAlbum']
    return <IconComponent />;
  }
  

  return <IconComponent />;
};

export default DynamicIconComponent;
