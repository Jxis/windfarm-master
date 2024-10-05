import React from 'react'
import PropTypes from 'prop-types'
import { useMutation, useQuery } from '@tanstack/react-query';
import instance from '../axios/instance';

const Admin = props => {

    const { data: users, isLoading, refetch } = useQuery({
       queryKey: ["Users"],
       queryFn: async () => {
         const response = await instance.get(`/user/all`);

         return response?.data?.users;
       },
    });
  
  const { mutate } = useMutation({
    mutationFn: async (payload) => {
      console.log(payload);

    const response = await instance.delete(`/user/remove/${payload._id}`);

    return response;
    },
    onSuccess: () => {
      refetch();
    }
  });
  
  
  if (isLoading) {
    <h1>Loading...</h1>
  }
  
  return (
    <>
      <h1>User List</h1>
      <div>
        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users?.map(({ email, role, _id }, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>{email}</td>
                <td>{role}</td>
                <td>
                  <button onClick={() => mutate({ _id: _id })}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

Admin.propTypes = {}

export default Admin