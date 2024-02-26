import React from 'react'

const DropdownElement = ( props ) => {
  let content = props.name;

  return(
    <div>
      <div>
        { content }
      </div>
    </div>
  )
}

export default DropdownElement