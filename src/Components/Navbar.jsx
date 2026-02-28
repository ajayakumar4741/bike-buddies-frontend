import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { UserContext } from "./UserContext";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  }

  function toggleNav() {
    setIsOpen(!isOpen);
  }

  // Safely extract name
  const displayName =
    user?.user?.full_name ||
    user?.user?.username ||
    user?.user?.email ||
    "";

  return (
    <>
      <nav className="navbar">
        <h1>Bike Buddies</h1>
        <ul>
          <li>
            <Link to="">Home</Link>
          </li>
          <li>
            <Link to="all-bikes">All Bikes</Link>
          </li>

          {user && (
            <>
              <li>
                <Link to="my-rides">My Rides</Link>
              </li>

              {/* 👇 Show Username */}
              <li className="username">
                Hello, {displayName}
              </li>

              <li style={{ cursor: "pointer" }} onClick={handleLogout}>
                Logout
              </li>
            </>
          )}

          {!user && (
            <li>
              <Link to="auth">Login</Link>
            </li>
          )}
        </ul>

        <div
          className={`hamburger ${isOpen ? "hamburger-active" : ""}`}
          onClick={toggleNav}
        >
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </nav>

      <div className={`menubar ${isOpen ? "active" : ""}`}>
        <ul>
          <li>
            <Link to="">Home</Link>
          </li>
          <li>
            <Link to="all-bikes">All Bikes</Link>
          </li>

          {user && (
            <>
              <li>
                <Link to="my-rides">My Rides</Link>
              </li>

              <li className="username">
                Hello, {displayName}
              </li>

              <li style={{ cursor: "pointer" }} onClick={handleLogout}>
                Logout
              </li>
            </>
          )}

          {!user && (
            <li>
              <Link to="auth">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;