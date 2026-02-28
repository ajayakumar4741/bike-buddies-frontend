import React, { useContext, useEffect, useState } from "react";
import "./OccupiedDates.css";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

const OccupiedDates = () => {
  const { user } = useContext(UserContext);
  const [groupedDates, setGroupedDates] = useState({});
  const navigate = useNavigate();
  const baseUrl = "http://localhost:8000";

  // Format for display only (dd-mm-yyyy)
  const formatDisplayDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Cancel a date range (backend expects YYYY-MM-DD)
  const handleCancelBooking = async (range) => {
    if (!user) return navigate("/auth");

    const startISO = range.startDate; // YYYY-MM-DD
    const endISO = range.endDate

    try {
      const response = await fetch(`${baseUrl}/api/occupied-dates/cancel-range/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${user.token}`,
        },
        body: JSON.stringify({
          start_date: startISO, // YYYY-MM-DD
          end_date: endISO,     // YYYY-MM-DD
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || "Booking cancelled successfully!");
        processAndSetDates();
      } else {
        const errorData = await response.json();
        alert("Failed to cancel booking: " + (errorData.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  // Cancel all occupied dates
  const handleCancelAll = async () => {
    if (!user) return navigate("/auth");
    try {
      const response = await fetch(`${baseUrl}/api/occupied-dates/cancel-all/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${user.token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || "All bookings cancelled successfully!");
        processAndSetDates();
      } else {
        const errorData = await response.json();
        alert("Failed to cancel all bookings: " + (errorData.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error cancelling all bookings:", error);
    }
  };

  // Fetch occupied dates
  async function fetchDates() {
    try {
      const response = await fetch(`${baseUrl}/api/occupied-dates/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${user.token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch occupied dates");
      return await response.json();
    } catch (err) {
      console.error("Error fetching occupied dates:", err);
      return [];
    }
  }

  // Group consecutive dates into ranges
  async function processAndSetDates() {
    const fetchedDates = await fetchDates();
    const dateStrings = fetchedDates.map((entry) => entry.date).sort();

    const ranges = {};
    let currentMonth = "";
    let currentRange = null;

    dateStrings.forEach((dateStr) => {
      const parsedDate = new Date(`${dateStr}T00:00:00`);
      if (isNaN(parsedDate.getTime())) return;

      const month = parsedDate.toLocaleString("en-IN", {
        month: "long",
        year: "numeric",
      });

      if (month !== currentMonth) {
        if (currentRange) {
          if (!ranges[currentMonth]) ranges[currentMonth] = [];
          ranges[currentMonth].push(currentRange);
        }
        currentMonth = month;
        currentRange = { startDate: dateStr, endDate: dateStr };
      } else {
        const prevDate = new Date(`${currentRange.endDate}T00:00:00`);
        prevDate.setDate(prevDate.getDate() + 1);

        if (parsedDate.toISOString().split("T")[0] === prevDate.toISOString().split("T")[0]) {
          currentRange.endDate = dateStr;
        } else {
          if (!ranges[currentMonth]) ranges[currentMonth] = [];
          ranges[currentMonth].push(currentRange);
          currentRange = { startDate: dateStr, endDate: dateStr };
        }
      }
    });

    if (currentRange) {
      if (!ranges[currentMonth]) ranges[currentMonth] = [];
      ranges[currentMonth].push(currentRange);
    }

    setGroupedDates(ranges);
  }

  useEffect(() => {
    if (user) processAndSetDates();
  }, [user]);

  return (
    <div className="occupied-dates-container">
      <div className="actions">
        <button className="btn cancel-all-btn" onClick={handleCancelAll}>
          Cancel All Bookings
        </button>
      </div>
      {Object.keys(groupedDates).map((month) => (
        <div key={month} className="month-section">
          <h2 className="month-title">{month}</h2>
          <div className="date-cards">
            {groupedDates[month].map((range, index) => (
              <div key={index} className="date-card">
                <p className="date-range">
                  {formatDisplayDate(range.startDate)} - {formatDisplayDate(range.endDate)}
                </p>
                <button
                  className="btn cancel-btn"
                  onClick={() => handleCancelBooking(range)}
                >
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OccupiedDates;