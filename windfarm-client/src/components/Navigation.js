import React from 'react'
import PropTypes from 'prop-types'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const Navigation = props => {

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


    if (role === "admin") {
        return (
        <div>
          <button onClick={() => navigate("/home")}>Home</button>
          <button onClick={() => navigate("/admin")}>Dashboard</button>
          <button onClick={() => navigate("/register")}>Create User</button>
          <button onClick={() => navigate("/admin/wind-farm-type")}>
            Create Wind Farm Type
          </button>
          <p>
            {role}: {email}
          </p>
          <button
            onClick={() => {
              navigate("/login");
              localStorage.removeItem("JWT_TOKEN");
            }}
          >
            Logout
          </button>
        </div>)
    }

  return (
      <div>
          <button onClick={() => navigate("/home")}>Home</button>
          <p>{role}: {email}</p>
          <button onClick={() => {
              navigate('/login')
              localStorage.removeItem("JWT_TOKEN")
          }
          }>Logout</button>
        </div>
  )
}

Navigation.propTypes = {}

export default Navigation