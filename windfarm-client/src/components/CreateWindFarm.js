import React from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@tanstack/react-query';
import instance from '../axios/instance';
import { useForm } from 'react-hook-form';

const CreateWindFarm = ({ windFarmType, coordinates, refetch }) => {
  const { register, handleSubmit } = useForm();

  const { mutate } = useMutation({
    mutationFn: async (payload) => {
      const response = await instance.post("/wind-farm/create", payload);

      return response;
    },
  });

  const onSubmit = ({ name }) => {
    if (!name) {
      console.error("Name is required!");
      return;
    }

    console.log(windFarmType);

    mutate(
      {
        name: name,
        location: {
          x: coordinates.lat,
          y: coordinates.lng,
        },
        windFarmType: windFarmType,
      },
      {
        onSuccess: (variables) => {
            const { data } = variables;
            refetch();
            return data;
        },
      }
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Enter Wind Farm Name" {...register("name")} />
        <button type="submit">Create Wind Farm</button>
      </form>
    </div>
  );
};

CreateWindFarm.propTypes = {}

export default CreateWindFarm