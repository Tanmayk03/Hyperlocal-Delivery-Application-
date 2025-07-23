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
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const validValue = Object.values(data).every(el => el.trim());
    const isFormValid = validValue && data.password === data.confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.password !== data.confirmPassword) {
            toast.error("Password and confirm password must be the same");
            return;
        }

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data: data
            });

            if (response.data.error) {
                toast.error(response.data.message);
            }

            if (response.data.success) {
                toast.success(response.data.message);
                setData(initialData);
                navigate("/login");
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <p>Welcome to Blinkit</p>

                <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='name'>Name:</label>
                        <input
                            type='text'
                            id='name'
                            autoFocus
                            className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
                            name='name'
                            value={data.name}
                            onChange={handleChange}
                            placeholder='Enter your name'
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='email'>Email:</label>
                        <input
                            type='email'
                            id='email'
                            className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='password'>Password:</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full outline-none'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter your password'
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className='cursor-pointer bg-transparent border-none p-0 m-0 flex items-center'
                                tabIndex={0}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                               {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}

                            </button>
                        </div>
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='confirmPassword'>Confirm Password:</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='confirmPassword'
                                className='w-full outline-none'
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Confirm your password'
                            />
                           <button
  type="button"
  onClick={() => setShowConfirmPassword(prev => !prev)}
  className='cursor-pointer bg-transparent border-none p-0 m-0 flex items-center'
  tabIndex={0}
  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
>
  {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
</button>

                        </div>
                    </div>

                    <button
                        type='submit'
                        disabled={!isFormValid}
                        className={`${
                            isFormValid
                                ? "bg-green-800 hover:bg-green-700"
                                : "bg-gray-500 cursor-not-allowed"
                        } text-white py-2 rounded font-semibold my-3 tracking-wide`}
                    >
                        Register
                    </button>
                </form>

                <p>
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
