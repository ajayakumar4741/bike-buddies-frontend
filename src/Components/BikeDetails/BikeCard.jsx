import React, { useContext } from "react";
import BikeImageSlider from "./BikeImageSlider";
import BikeInfo from "./BikeInfo";

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
        console.log(user.token)
      const baseURL = "http://127.0.0.1:8000";
      const bikeUrl = `${baseURL}/api/bikes/${bikeId}/`;
      const userUrl = `${baseURL}/api/users/${userId}/`;
      if (selectedDateRange.startDate && !selectedDateRange.endDate) {
      selectedDateRange.endDate = selectedDateRange.startDate;
    }
    for (
      let currentDate = new Date(selectedDateRange.startDate);
      currentDate <= new Date(selectedDateRange.endDate);
      currentDate.setDate(currentDate.getDate() + 1)
    ){
      try {
        const response = await fetch(`${baseURL}/api/occupied-dates/`, {
          method: "POST",
          headers: {
            'Content-Type': "application/json",
            Authorization: `Token ${user.token}`,
          },
          body: JSON.stringify({
            bike: bikeUrl,
            user: userUrl,
            date: currentDate.toISOString().split("T")[0],
          })
          })
          if (!response.ok) {
            throw new Error("Failed to book ride");
          }
          const data = await response.json();
          console.log("Booking successful:", data);
          onBookingSuccess();
      } catch (error) {
        console.error("Booking failed:", error);
      }
    }
    }
    
    return (
         <div className="room-card">
      <BikeImageSlider images={bike.images} />
      <BikeInfo bike={bike} />
      {selectedDateRange ? (
        <button
          className="btn"
          onClick={() =>
            handleBooking({bikeId: bike.id, userId: user.user.id, selectedDateRange: selectedDateRange})
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