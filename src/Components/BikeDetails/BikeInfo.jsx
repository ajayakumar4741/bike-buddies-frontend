import React from 'react'

const BikeInfo = ({ bike }) => {
  return (
     <div className="room-info">
      <h2>{bike.name}</h2>
      <p>
        <strong>Type:</strong> {bike.type}
      </p>
      <p>
        <strong>Price per Ride:</strong> {bike.currency} {bike.pricePerRide}
      </p>
      <p>
        <strong>Max Occupancy:</strong> {bike.maxOccupancy} 
      </p>
      <p className="description">{bike.description}</p>
    </div>
  )
}

export default BikeInfo
