import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data }) => {
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemDetails] = useState(null)

    const handleAddToCart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setLoading(true)

            const response = await Axios({
                ...SummaryApi.addTocart,
                data: {
                    productId: data?._id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                fetchCartItem?.()
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    // Check if this item is in the cart
    useEffect(() => {
        const existingItem = cartItem.find(item => item?.productId?._id === data?._id)
        setIsAvailableCart(!!existingItem)
        setQty(existingItem?.quantity || 0)
        setCartItemDetails(existingItem || null)
    }, [data, cartItem])

    const increaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!cartItemDetails) return

        const response = await updateCartItem(cartItemDetails._id, qty + 1)

        if (response?.success) {
            toast.success("Item added")
        }
    }

    const decreaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!cartItemDetails) return

        if (qty === 1) {
            await deleteCartItem(cartItemDetails._id)
        } else {
            const response = await updateCartItem(cartItemDetails._id, qty - 1)
            if (response?.success) {
                toast.success("Item removed")
            }
        }
    }

    return (
        <div className='w-full max-w-[150px]'>
            {
                isAvailableCart ? (
                    <div className='flex w-full h-full'>
                        <button onClick={decreaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'>
                            <FaMinus />
                        </button>

                        <p className='flex-1 w-full font-semibold px-1 flex items-center justify-center'>{qty}</p>

                        <button onClick={increaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'>
                            <FaPlus />
                        </button>
                    </div>
                ) : (
                    <button onClick={handleAddToCart} className='bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded'>
                        {loading ? <Loading /> : "Add"}
                    </button>
                )
            }
        </div>
    )
}

// ✅ Add prop types for validation
AddToCartButton.propTypes = {
    data: PropTypes.shape({
        _id: PropTypes.string.isRequired
    }).isRequired
}

export default AddToCartButton
