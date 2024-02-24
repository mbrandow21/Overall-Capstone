import React from 'react'

const BackButton = () => {
  const goBack = () => {
    window.history.back()
  }

  return (
    <div><button onClick={goBack}>Go Back</button></div>
  )
}

export default BackButton