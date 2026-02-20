import React, { useContext } from "react";
import BikeImageSlider from "./BikeImageSlider";
import BikeInfo from "./Bikeinfo";

import "./BikeDetails.css";
import { UserContext } from "../UserContext";
import { redirect, useNavigate } from "react-router-dom";

const BikeCard = ({bike, selectedDateRange, onBookingSuccess}) => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const handleBooking = async ({bikeId, userId, selectedDateRange}) => {
        if (!user) {
            return navigate('/auth');            
        }
    }
    return (
         <div className="room-card">
      <RoomImageSlider images={bike.images} />
      <RoomInfo bike={bike} />
      {selectedDateRange ? (
        <button
          className="book-room-button"
          onClick={() =>
            handleBooking(bike.id, user.user.id, selectedDateRange)
          }
          disabled={!selectedDateRange.startDate}
        >
          Book Ride
        </button>
      ) : null}
    </div>
    )
}

export default BikeCard;