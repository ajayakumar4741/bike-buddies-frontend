import React from 'react'

const BikeImage = () => {
  return (
    <div className="image-slider">
       <button onClick={handlePrev}>&#10094;</button>
      <img
        src={images[currentIndex].image}
        alt="Room"
        className="slider-image"
      />
      <button onClick={handleNext}>&#10095;</button>
    </div>
  )
}

export default BikeImage
