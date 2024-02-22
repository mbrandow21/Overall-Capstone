import React, { useEffect, useState } from 'react';
import * as tfiIcons from 'react-icons/tfi';
import * as luIcons from "react-icons/lu";
import * as aiicons from "react-icons/ai";

const DynamicIconComponent = ({ iconName, iconRoute }) => {
  let IconComponent = luIcons['LuAlbum']

  if (iconRoute == 'react-icons/tfi'){
    IconComponent = tfiIcons[iconName];
  }
  if (iconRoute == 'react-icons/lu'){
    IconComponent = luIcons[iconName]
  }
  if (iconRoute == 'react-icons/ai'){
    IconComponent = aiicons[iconName]
  }

  return <IconComponent />;
};

export default DynamicIconComponent;
