import React from 'react'
import './AllBikes.css';
import BikeCard from './BikeDetails/BikeCard';

const AllBikes = () => {
    const [bikeData, setBikeData] = React.useState([]);

    React.useEffect(() => {
        async function fetchBikeData() {
            try {
                const response = await fetch("http://localhost:8000/api/bikes/", {
                    method: "GET",

                });
                if (!response.ok) {
                    throw new Error("Failed to fetch bike data");
                }
                const data = await response.json();
                setBikeData(data);
            } catch (err){
                console.error("Error fetching bike data:", err);
            }
        }
        fetchBikeData();
    }, [])
  return (
    <div className="all-rooms-container">
      <h2>All Rides</h2>
      <div className="rooms-list">
        {bikeData.map((bike) => (
          <BikeCard key={bike.id} bike={bike} />
        ))}
      </div>
    </div>
  )
}

export default AllBikes
