import React, { useState } from 'react';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validValue = Object.values(data).every(el => el.trim() !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const response = await Axios({
        ...SummaryApi.login,
        data: data
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);

        const { user, accessToken, refreshToken } = response.data.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        dispatch(setUserDetails({
          _id: user.id,
          name: user.name,
          email: user.email,
          status: user.status,
        }));

        setData({
          email: "",
          password: "",
        });

        navigate("/");
      }

    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
        <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label htmlFor='email'>Email :</label>
            <input
              type='email'
              id='email'
              name='email'
              value={data.email}
              onChange={handleChange}
              placeholder='Enter your email'
              autoComplete='email'
              className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
            />
          </div>

          <div className='grid gap-1'>
            <label htmlFor='password'>Password :</label>
            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                id='password'
                name='password'
                value={data.password}
                onChange={handleChange}
                placeholder='Enter your password'
                autoComplete='current-password'
                className='bg-blue-50 p-2 pr-10 w-full border rounded outline-none focus:border-primary-200'
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700'
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            <Link to="/forgot-password" className='block ml-auto hover:text-primary-200'>
              Forgot password?
            </Link>
          </div>

          <button
            disabled={!validValue || loading}
            className={`${validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register" className='font-semibold text-green-700 hover:text-green-800'>
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
