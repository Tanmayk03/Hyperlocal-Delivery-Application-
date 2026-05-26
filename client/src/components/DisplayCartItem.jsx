import React from 'react'
import PropTypes from 'prop-types'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'

const DisplayCartItem = ({ close }) => {
  const globalContext = useGlobalContext();
  const { notDiscountTotalPrice = 0, totalPrice = 0, totalQty = 0 } = globalContext || {};
  const cartItem = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      navigate("/checkout")
      if (close) close()
    } else {
      toast("Please Login")
    }
  }

  const deliveryCharge = totalPrice >= 300 ? 0 : (totalPrice >= 150 ? 20 : 40);

  const getMilestoneInfo = () => {
    if (totalPrice === 0) {
      return {
        text: "Add items to unlock offers!",
        percentage: 0,
        color: 'bg-slate-300',
        textColor: 'text-slate-600',
        bgColor: 'bg-slate-50'
      };
    }
    if (totalPrice < 150) {
      const remaining = 150 - totalPrice;
      return {
        text: `Add ${DisplayPriceInRupees(remaining)} more for 50% off delivery!`,
        percentage: (totalPrice / 450) * 100,
        color: 'bg-amber-500',
        textColor: 'text-amber-850',
        bgColor: 'bg-amber-50'
      };
    } else if (totalPrice < 300) {
      const remaining = 300 - totalPrice;
      return {
        text: `50% off unlocked! Add ${DisplayPriceInRupees(remaining)} more for Free Delivery!`,
        percentage: (totalPrice / 450) * 100,
        color: 'bg-yellow-500',
        textColor: 'text-yellow-850',
        bgColor: 'bg-yellow-50'
      };
    } else if (totalPrice < 450) {
      const remaining = 450 - totalPrice;
      return {
        text: `Free Delivery unlocked! Add ${DisplayPriceInRupees(remaining)} more for a Free Surprise Gift!`,
        percentage: (totalPrice / 450) * 100,
        color: 'bg-green-500',
        textColor: 'text-green-850',
        bgColor: 'bg-green-50'
      };
    } else {
      return {
        text: `Free Delivery + Free Gift (Surprise Snack) unlocked!`,
        percentage: 100,
        color: 'bg-emerald-600',
        textColor: 'text-emerald-850',
        bgColor: 'bg-emerald-50'
      };
    }
  };
  const milestone = getMilestoneInfo();

  return (
    <section className='bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-70 z-50'>
      <div className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto'>
        <div className='flex items-center p-4 shadow-md gap-3 justify-between'>
          <h2 className='font-semibold'>Cart</h2>
          <Link to="/" className='lg:hidden'>
            <IoClose size={25} />
          </Link>
          <button onClick={close} className='hidden lg:block'>
            <IoClose size={25} />
          </button>
        </div>

        <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4'>
          {
            cartItem[0] ? (
              <>
                <div className='flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full'>
                  <p>Your total savings</p>
                  <p>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</p>
                </div>

                {/* Milestone Progress Bar */}
                <div className={`p-3 rounded-xl border border-dashed flex flex-col gap-2 mt-1 ${milestone.bgColor} ${milestone.textColor}`}>
                  <p className="text-xs font-semibold leading-tight">{milestone.text}</p>
                  <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full transition-all duration-500 ease-out ${milestone.color}`}
                      style={{ width: `${milestone.percentage}%` }}
                    ></div>
                    {/* Tick Marks for Milestones */}
                    <div className="absolute left-[33.3%] top-0 bottom-0 w-0.5 bg-white opacity-60" title="50% Off (₹150)"></div>
                    <div className="absolute left-[66.6%] top-0 bottom-0 w-0.5 bg-white opacity-60" title="Free Delivery (₹300)"></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-bold opacity-75">
                    <span>₹0</span>
                    <span>50% Off (₹150)</span>
                    <span>Free Del (₹300)</span>
                    <span>Free Gift (₹450)</span>
                  </div>
                </div>

                <div className='bg-white rounded-lg p-4 grid gap-5 overflow-auto'>
                  {
                    cartItem.map((item) => (
                      <div key={item?._id + "cartItemDisplay"} className='flex w-full gap-4'>
                        <div className='w-16 h-16 min-h-16 min-w-16 bg-red-500 border rounded'>
                          <img
                            src={item?.productId?.image[0]}
                            className='object-scale-down w-full h-full'
                            alt={item?.productId?.name || 'Product image'}
                          />
                        </div>
                        <div className='w-full max-w-sm text-xs'>
                          <p className='text-xs text-ellipsis line-clamp-2'>{item?.productId?.name}</p>
                          <p className='text-neutral-400'>{item?.productId?.unit}</p>
                          <p className='font-semibold'>
                            {DisplayPriceInRupees(pricewithDiscount(item?.productId?.price, item?.productId?.discount))}
                          </p>
                        </div>
                        <div>
                          <AddToCartButton data={item?.productId} />
                        </div>
                      </div>
                    ))
                  }
                </div>

                <div className='bg-white p-4'>
                  <h3 className='font-semibold'>Bill details</h3>
                  <div className='flex gap-4 justify-between ml-1'>
                    <p>Items total</p>
                    <p className='flex items-center gap-2'>
                      <span className='line-through text-neutral-400'>
                        {DisplayPriceInRupees(notDiscountTotalPrice)}
                      </span>
                      <span>{DisplayPriceInRupees(totalPrice)}</span>
                    </p>
                  </div>
                  <div className='flex gap-4 justify-between ml-1'>
                    <p>Quantity total</p>
                    <p>{totalQty} item</p>
                  </div>
                  <div className='flex gap-4 justify-between ml-1 text-xs'>
                    <p>Delivery Charge</p>
                    <p className={deliveryCharge === 0 ? 'text-green-600 font-semibold' : ''}>
                      {deliveryCharge === 0 ? 'Free' : DisplayPriceInRupees(deliveryCharge)}
                    </p>
                  </div>
                  <div className='font-semibold flex items-center justify-between gap-4 text-sm mt-1 pt-1 border-t border-slate-100'>
                    <p>Grand total</p>
                    <p>{DisplayPriceInRupees(totalPrice + deliveryCharge)}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className='bg-white flex flex-col justify-center items-center'>
                <img
                  src={imageEmpty}
                  className='w-full h-full object-scale-down'
                  alt="Empty cart"
                />
                <Link onClick={close} to="/" className='block bg-green-600 px-4 py-2 text-white rounded'>
                  Shop Now
                </Link>
              </div>
            )
          }
        </div>

        {
          cartItem[0] && (
            <div className='p-2'>
                
              <div className='bg-green-700 text-neutral-100 px-4 font-bold text-base py-4 static bottom-3 rounded flex items-center gap-4 justify-between'>
                <div>{DisplayPriceInRupees(totalPrice + deliveryCharge)}</div>
                <button onClick={redirectToCheckoutPage} className='flex items-center gap-1'>
                  <span>Proceed</span>
                  <FaCaretRight />
                </button>
              </div>
            </div>
          )
        }
      </div>
    </section>
  )
}

// ✅ PropTypes validation
DisplayCartItem.propTypes = {
  close: PropTypes.func
}

export default DisplayCartItem
