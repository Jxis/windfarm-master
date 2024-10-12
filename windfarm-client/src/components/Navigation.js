import React from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../styles/css/Navigation.css";

const Navigation = (props) => {
  const navigate = useNavigate();

  const getJwtToken = () => {
    return localStorage.getItem("JWT_TOKEN");
  };

  const jwtToken = getJwtToken();

  if (!jwtToken) {
    return null;
  }

  const { email, role } = jwtDecode(jwtToken);
  console.log(role);
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <button className="nav-button" onClick={() => navigate("/home")}>
            Home
          </button>
        </li>

        {role === "admin" && (
          <>
            <li>
              <button className="nav-button" onClick={() => navigate("/admin")}>
                Dashboard
              </button>
            </li>
            <li>
              <button
                className="nav-button"
                onClick={() => navigate("/register")}
              >
                Create User
              </button>
            </li>
            <li>
              <button
                className="nav-button"
                onClick={() => navigate("/admin/wind-farm-type")}
              >
                Create Wind Farm Type
              </button>
            </li>
          </>
        )}
      </ul>

      <div className="nav-user">
        <p>
          {role}: {email}
        </p>
        <button
          className="logout-button"
          onClick={() => {
            navigate("/login");
            localStorage.removeItem("JWT_TOKEN");
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

Navigation.propTypes = {};

export default Navigation;
