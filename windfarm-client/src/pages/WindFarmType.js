import React from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import instance from "../axios/instance";

const WindFarmType = (props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { mutate } = useMutation({
    mutationFn: async (payload) => {
      const response = await instance.post("/wind-farm-type/create", payload);

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
        <input placeholder="Enter wind farm type name" {...register("name")} />

        <input
          placeholder="Enter wind farm type efficiency"
          {...register("efficiency")}
        />
        <button type="submit">Create Wind Farm Type</button>
      </form>
    </div>
  );
};

WindFarmType.propTypes = {};

export default WindFarmType;
