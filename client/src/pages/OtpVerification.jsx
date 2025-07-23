import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const OtpVerification = () => {
    const [data, setData] = useState(["", "", "", "", "", ""])
    const inputRef = useRef([])
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!location?.state?.email) {
            navigate("/forgot-password")
        }
    }, [location, navigate])

    const validValue = data.every(el => el.trim() !== "")

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data: {
                    otp: data.join(""),
                    email: location?.state?.email
                }
            })

            if (response.data.error) {
                toast.error(response.data.message)
                return
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setData(["", "", "", "", "", ""])
                navigate("/reset-password", {
                    state: {
                        data: response.data,
                        email: location?.state?.email
                    }
                })
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return // Only digits

        const newData = [...data]
        newData[index] = value
        setData(newData)

        // Move to next if a value is entered
        if (value && index < 5) {
            inputRef.current[index + 1]?.focus()
        }

        // Move to previous if cleared
        if (!value && index > 0) {
            inputRef.current[index - 1]?.focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !data[index] && index > 0) {
            inputRef.current[index - 1]?.focus()
        }
    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <p className='font-semibold text-lg'>Enter OTP</p>
                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='otp'>Enter Your OTP:</label>
                        <div className='flex items-center gap-2 justify-between mt-3'>
                            {
                                data.map((value, index) => (
                                    <input
                                        key={`otp-${location?.state?.email || "unknown"}-${index}`}
                                        type='text'
                                        inputMode='numeric'
                                        maxLength={1}
                                        id={`otp-${index}`}
                                        ref={(el) => inputRef.current[index] = el}
                                        value={value}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className='bg-blue-50 w-full max-w-16 p-2 border rounded outline-none focus:border-primary-200 text-center font-semibold'
                                    />
                                ))
                            }
                        </div>
                    </div>

                    <button
                        disabled={!validValue}
                        className={`${validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}
                    >
                        Verify OTP
                    </button>
                </form>

                <p>
                    Already have an account?{" "}
                    <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-800'>Login</Link>
                </p>
            </div>
        </section>
    )
}

export default OtpVerification
