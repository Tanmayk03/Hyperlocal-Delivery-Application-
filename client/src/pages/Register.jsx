import React, { useState } from 'react';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios.js';
import SummaryApi from '../common/SummaryApi.js';
import AxiosToastError from '../utils/AxiosToastError.js';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const initialData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  const [data, setData] = useState(initialData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const validValue = Object.values(data).every(el => el.trim());
  const isFormValid = validValue && data.password === data.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("Password and Confirm Password must match");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: data
      });

      const res = response?.data;

      if (res.error) {
        toast.error(res.message);
        return;
      }

      if (res.success) {
        toast.success(res.message);

        // If email verification is required, redirect to verification page
        if (res?.verificationRequired || res?.email) {
          navigate(`/verify-email?email=${data.email}`);
        } else {
          // Old flow fallback
          navigate("/login");
        }

        setData(initialData);
      }
    } catch (err) {
      AxiosToastError(err);
    }
  };

  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
        <p className='text-lg font-semibold'>Welcome to Blinkit</p>

        <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
          {/* Name */}
          <div className='grid gap-1'>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              id='name'
              name='name'
              value={data.name}
              onChange={handleChange}
              placeholder='Enter your name'
              className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
            />
          </div>

          {/* Email */}
          <div className='grid gap-1'>
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              name='email'
              value={data.email}
              onChange={handleChange}
              placeholder='Enter your email'
              className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
            />
          </div>

          {/* Password */}
          <div className='grid gap-1'>
            <label htmlFor='password'>Password:</label>
            <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
              <input
                type={showPassword ? "text" : "password"}
                id='password'
                name='password'
                value={data.password}
                onChange={handleChange}
                placeholder='Enter password'
                className='w-full outline-none bg-transparent'
              />
              <button type="button" onClick={() => setShowPassword(prev => !prev)} className='ml-2'>
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className='grid gap-1'>
            <label htmlFor='confirmPassword'>Confirm Password:</label>
            <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id='confirmPassword'
                name='confirmPassword'
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder='Confirm password'
                className='w-full outline-none bg-transparent'
              />
              <button type="button" onClick={() => setShowConfirmPassword(prev => !prev)} className='ml-2'>
                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type='submit'
            disabled={!isFormValid}
            className={`${
              isFormValid ? "bg-green-800 hover:bg-green-700" : "bg-gray-500 cursor-not-allowed"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Register
          </button>
        </form>

        <p className='text-center text-sm'>
          Already have an account?{" "}
          <Link to="/login" className='font-semibold text-green-700 hover:text-green-800'>
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
