import React, { useContext } from 'react'
import './OccupiedDates.css';
import { UserContext } from './UserContext';

const OccupiedDates = () => {
    const { user } = useContext(UserContext);
    const [groupedDates, setGroupedDates] = React.useState([]);

    

    React.useEffect(() => {
        console.log(user)
        if (!user){
            return;
        }
    }, [])
    const baseUrl = "http://localhost:8000";
    
    const handleCancelBooking = async ({ bookingId }) => {
  if (!user) {
    return navigate("/auth");
  }

  try {
    // Example: call your backend API to cancel the booking
    const response = await fetch(`${baseUrl}/api/bookings/${bookingId}/cancel/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`, // if you use JWT
      },
      body: JSON.stringify({ userId: user.user.id }),
    });

    if (response.ok) {
      // Notify parent component or update state
      if (onBookingSuccess) {
        onBookingSuccess(null); // clear booking
      }
      // Navigate back to bikes page or dashboard
      navigate("/bikes");
    } else {
      console.error("Failed to cancel booking");
    }
  } catch (error) {
    console.error("Error cancelling booking:", error);
  }
};
    async function fetchDates(){
        try {
            const response = await fetch(`${baseUrl}/api/occupied-dates/`, {
                method: "GET",
                headers: {
                    'Content-Type': "application/json",
                    Authorization: `Token ${user.token}`,
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch occupied dates");
            }
            console.log(user.token)
            const data = await response.json();
            console.log(data)
            return data;
        } catch (err){
            console.error("Error fetching occupied dates:", err);
            return [];
        }
    }
    async function processAndSetDates() {
      const fetchedDates = await fetchDates(); // Wait for fetchDates to resolve

      // Process dates into grouped ranges
      const processDates = (dates) => {
        // Extract only the date strings
        const dateStrings = dates.map((entry) => entry.date);

        // Ensure dates are sorted chronologically
        const sortedDates = dateStrings.sort();

        const ranges = {};
        let currentMonth = "";
        let currentRange = null;

        sortedDates.forEach((dateStr) => {
          // Parse the date explicitly to ensure it's valid
          const date = new Date(`${dateStr}T00:00:00`); // Add `T00:00:00` to avoid parsing issues

          if (isNaN(date.getTime())) {
            console.error("Invalid date:", dateStr);
            return; // Skip invalid dates
          }

          const month = date.toLocaleString("en-IN", {
            month: "long",
            year: "numeric",
          });

          if (month !== currentMonth) {
            // If month changes, finalize the previous range
            if (currentRange) {
              if (!ranges[currentMonth]) ranges[currentMonth] = [];
              ranges[currentMonth].push(currentRange);
            }
            currentMonth = month;
            currentRange = { startDate: dateStr, endDate: dateStr };
          } else {
            // Check if the date is consecutive
            const prevDate = new Date(`${currentRange.endDate}T00:00:00`);
            prevDate.setDate(prevDate.getDate() + 1); // Add 1 day to check continuity

            if (
              date.toISOString().split("T")[0] ===
              prevDate.toISOString().split("T")[0]
            ) {
              // Extend the current range
              currentRange.endDate = dateStr;
            } else {
              // Finalize the current range and start a new one
              if (!ranges[currentMonth]) ranges[currentMonth] = [];
              ranges[currentMonth].push(currentRange);
              currentRange = { startDate: dateStr, endDate: dateStr };
            }
          }
        });

        // Finalize the last range
        if (currentRange) {
          if (!ranges[currentMonth]) ranges[currentMonth] = [];
          ranges[currentMonth].push(currentRange);
        }

        return ranges;
      };

      setGroupedDates(processDates(fetchedDates));
    }

    React.useEffect(() => {
      processAndSetDates(); // Fetch and process dates
    }, [user]);
  return (
    <>
     <div className="occupied-dates-container">
      {Object.keys(groupedDates).map((month) => (
        <div key={month} className="month-section">
          <h2 className="month-title">{month}</h2>
          <div className="date-cards">
            {groupedDates[month].map((range, index) => (
              <div key={index} className="date-card">
                <p className="date-range">
                  {new Date(range.startDate).toLocaleDateString("en-IN")} -{" "}
                  {new Date(range.endDate).toLocaleDateString("en-IN")}
                </p>
                <button
          className="btn cancel-btn"
          onClick={() => handleCancelBooking({ bookingId: range.bookingId })}
        >
          Cancel Booking
        </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    </>
  )
}

export default OccupiedDates
