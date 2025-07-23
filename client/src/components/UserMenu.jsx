import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink } from 'react-icons/hi'
import isAdmin from '../utils/isAdmin'

const UserMenu = ({ close }) => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        console.log("Logout button clicked")
        try {
            const response = await Axios({ url: SummaryApi.logout.url, method: SummaryApi.logout.method })
            if (response.status === 200) {
                dispatch(logout())
                localStorage.clear()
                toast.success("Logged out successfully")
                navigate("/")

                // Close the menu if the close function exists
                if (typeof close === 'function') {
                    close()
                }
            }
        } catch (error) {
            console.log('AXIOS ERROR RESPONSE', error.response)

            if (error.response) {
                AxiosToastError(error)
            } else if (error.request) {
                console.log('No response received', error.request)
                toast.error("Network error or server not responding")
            } else {
                console.log('Error setting up request', error.message)
                toast.error("Something went wrong")
            }

            // Clear session even if logout fails
            dispatch(logout())
            localStorage.clear()
            toast.error("Session cleared locally due to logout failure")

            // Close the menu if the close function exists
            if (typeof close === 'function') {
                close()
            }
        }
    }

    return (
        <div>
            <div className='font-semibold'>My Account</div>
            <div className='text-sm text-gray-600 flex items-center gap-2 mt-1 mb-2'>
                <span className='max-w-52 text-ellipsis line-clamp-1'>{user.name || user.mobile || 'Guest'}<span className='text-medium text-red-500'> ({user.role === "ADMIN" ? "Admin" : ""}) </span></span>
                <Link to={"/dashboard/profile"} className='hover:text-primary-200'><HiOutlineExternalLink size={15} /></Link>
            </div>
            <Divider />

            <div className='text-sm grid gap-1 mt-4'>
                {
                    isAdmin(user.role) && (
                        <Link to={"/dashboard/category"} className='px-2 hover:bg-green-200'>Category</Link>

                    )
                }
                {
                    isAdmin(user.role) && (
                        <Link to={"/dashboard/subcategory"} className='px-2 hover:bg-green-200'>Sub Category</Link>

                    )
                }
                {
                    isAdmin(user.role) && (
                        <Link to={"/dashboard/upload-product"} className='px-2 hover:bg-green-200'>Upload Product</Link>


                    )
                }
                {
                    isAdmin(user.role) && (

                        <Link to={"/dashboard/product"} className='px-2 hover:bg-green-200'>Product</Link>


                    )
                }

                <Link to={"/dashboard/myorders"} className='px-2 hover:bg-green-200'>My Orders</Link>

                <Link to={"/dashboard/address"} className='px-2 hover:bg-green-200'>Save Address</Link>

                <button onClick={handleLogout} className='text-left px-2 hover:bg-green-200'>Logout</button>
            </div>
        </div>
    )
}
UserMenu.propTypes = {
    close: PropTypes.func
}

export default UserMenu
