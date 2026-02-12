import React from 'react'
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import './BookingComponent.css';

const BookingComponent = () => {
  return (
    <div className="booking-container">
      <div className="calendar-header">
        <button className="date-switcher" >
          <FaArrowLeft></FaArrowLeft>{" "}
        </button>
        <h2>
          
        </h2>
        <button className="date-switcher" >
          <FaArrowRight></FaArrowRight>
        </button>
      </div>

      <div className="calendar-days">
       
        
      </div>

      <button className="book-rooms-button" onClick={handleFilterRooms}>
        Book Rides
      </button>

       <div className="error-message"></div>

      <div className="filtered-rooms">
        
      </div>
    </div>
  );
}

export default BookingComponent
