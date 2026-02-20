import React from 'react'

const BikeInfo = ({ bike }) => {
  return (
     <div className="room-info">
      <h2>{bike.bikeName}</h2>
      <p>
        <strong>Type:</strong> {bike.bikeType}
      </p>
      <p>
        <strong>Price per Ride:</strong> {bike.currency} {bike.pricePerRide}
      </p>
      <p>
        <strong>Max Occupancy:</strong> {bike.maxOccupancy} guests
      </p>
      <p className="description">{bike.description}</p>
    </div>
  )
}

export default BikeInfo
