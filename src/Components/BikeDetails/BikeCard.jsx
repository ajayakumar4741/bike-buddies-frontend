import React, { useContext } from "react";
import BikeImageSlider from "./BikeImageSlider";
import BikeInfo from "./BikeInfo";

import "./BikeDetails.css";
import { UserContext } from "../UserContext";
import { redirect, useNavigate } from "react-router-dom";

const BikeCard = ({bike, selectedDateRange, onBookingSuccess}) => {
   
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    
    const handleBooking = async ({bikeId, userId, selectedDateRange }) => {
        if (!user) {
            return navigate('/auth');            
        }
        const start = new Date(selectedDateRange.startDate);
  const end = new Date(selectedDateRange.endDate);

  // Difference in days (inclusive)
  const diffInTime = end.getTime() - start.getTime();
  const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24)) + 1;

  // Calculate total price
  const bikePrice = bike.pricePerRide * diffInDays;

        // Navigate to payment home page with booking details
        navigate('/payment-home', { 
            state: { 
                bikeId: bikeId,
                userId: userId,
                selectedDateRange: selectedDateRange,
                bikePrice: bikePrice,
                bikeCurrency: bike.currency
            } 
        });
    };
    
    return (
      <>
         <div className="room-card">
      <BikeImageSlider images={bike.images} />
      <BikeInfo bike={bike} />
    {selectedDateRange ? (
      <>
        <button
          className="btn"
          onClick={() =>
            handleBooking({bikeId: bike.id, userId: user.user.id, selectedDateRange: selectedDateRange})
          }
          disabled={!selectedDateRange.startDate}
        >
          Book Ride
        </button>
        
      </>
    ) : null}
    </div>
    </>
    )
}

export default BikeCard;