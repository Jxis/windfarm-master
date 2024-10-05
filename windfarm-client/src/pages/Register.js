import React from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import instance from "../axios/instance";

const Register = (props) => {
const {
  register,
  handleSubmit,
  watch,
  formState: { errors },
} = useForm();
const navigate = useNavigate();

const { mutate } = useMutation({
  mutationFn: async (payload) => {
    const response = await instance.post("/auth/register", payload);

    return response;
  },
});

const onSubmit = ({ email, password }) => {
  mutate(
    { email, password },
    {
      onSuccess: (variables) => {
        const { data } = variables;
       
      },
    }
  );
};

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Enter email address" {...register("email")} />

        <input placeholder="Enter password" {...register("password")} />
        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

Register.propTypes = {};

export default Register;
