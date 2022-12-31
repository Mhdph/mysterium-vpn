import React, {useState} from 'react';
import {XMarkIcon} from '@heroicons/react/24/solid';
import {allUserFn, baseUrl} from '../config';
import axios from 'axios';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import {useQuery, useQueryClient} from 'react-query';

const AddUser = ({showModal, setShowModal}: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const queryClient = useQueryClient();

  const {isLoading, data, error} = useQuery({
    queryKey: ['userlist'],
    queryFn: allUserFn,
  });
  const AddUserFn = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const usersId = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        `${baseUrl}/users/`,
        {
          username,
          password: password,
          confirmPassword: confirmPassword,
        },
        {headers: {Authorization: `Bearer ${token}`}},
      );
      toast.success('User Added successfully', {
        autoClose: 2000,
      });
      queryClient.invalidateQueries('userlist');
      setShowModal(false);
    } catch (err) {
      toast.error('Something is wrong');
    }
  };

  return (
    <>
      {showModal ? (
        <>
          <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none'>
            <div className='w-full max-w-xs'>
              <div className='mb-4 rounded-lg bg-white px-8 pt-6 pb-8 shadow-2xl'>
                <div className='flex items-center justify-between'>
                  <p className='flex items-center py-4 font-bold text-blue-700'>Add new User</p>
                  <XMarkIcon onClick={() => setShowModal(false)} className='h-5 w-5 cursor-pointer text-gray-800' />
                </div>
                <div className='mb-4'>
                  <label className='mb-2 block text-sm font-bold text-gray-700'>Username</label>
                  <input
                    className='focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none'
                    id='username'
                    type='text'
                    placeholder='username'
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className='mb-4'>
                  <label className='mb-2 block text-sm font-bold text-gray-700'>Password</label>
                  <input
                    className='focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none'
                    id='password'
                    type='password'
                    placeholder='password'
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className='mb-6'>
                  <label className='mb-2 block text-sm font-bold text-gray-700'>Confirm Password</label>
                  <input
                    className='focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none'
                    id='password'
                    type='password'
                    placeholder='confirm password'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className='flex items-center justify-between'>
                  <button
                    className='focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none'
                    type='button'
                    onClick={AddUserFn}
                  >
                    Create User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default AddUser;
