import React from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import instance from "../axios/instance";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";

const Login = (props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async (payload) => {
      const response = await instance.post("/auth/login", payload);

      return response;
    },
  });

  const onSubmit = ({ email, password }) => {
    mutate(
      { email, password },
      {
        onSuccess: (variables) => {
          console.log("User created successfully:", variables.data);
          const { data } = variables;
          if (data) {
            const { jwtToken } = data;

            localStorage.setItem("JWT_TOKEN", jwtToken);
            navigate("/home");
          }
        },
        onError: (error) => {
          console.error(
            "Error during registration:",
            error.response?.data || error.message
          );
        },
      }
    );
  };

  return (
    <div className="container">
      <div className="animation-container">
        <div className="wind"></div>
        <div className="turbine"></div> {/* Turbine graphic */}
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>WindFarm Login</h1>
          <input
            placeholder="Enter your email"
            {...register("email", { required: true })}
          />
          {errors.email && <p>Email is required</p>}
          <input
            type="password"
            placeholder="Enter your password"
            {...register("password", { required: true })}
          />
          {errors.password && <span>Password is required</span>}
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
};

Login.propTypes = {};

export default Login;
