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
        
        // Navigate to payment home page with booking details
        navigate('/payment-home', { 
            state: { 
                bikeId: bikeId,
                userId: userId,
                selectedDateRange: selectedDateRange,
                bikePrice: bike.pricePerRide,
                bikeCurrency: bike.currency
            } 
        });
    };
    
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