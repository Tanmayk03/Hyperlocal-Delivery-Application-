import React from 'react';
import { Link } from 'react-router-dom';
import { FaCartShopping } from 'react-icons/fa6';
import { FaCaretRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useGlobalContext } from '../provider/GlobalProvider'; // Correct import for hook
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';

const CartMobileLink = () => {
  // Use the hook, not the provider component itself
  const { totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector(state => state.cartItem.cart);

  return (
    <>
      {cartItem[0] && (
        <div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] z-50'>
          <div className='bg-green-600 px-2 py-1 rounded text-neutral-100 text-sm flex items-center justify-between gap-3 lg:hidden shadow-md'>
            <div className='flex items-center gap-2'>
              <div className='p-2 bg-green-500 rounded w-fit'>
                <FaCartShopping />
              </div>
              <div className='text-xs'>
                <p>{totalQty} items</p>
                <p>{DisplayPriceInRupees(totalPrice)}</p>
              </div>
            </div>

            <Link to="/cart" className='flex items-center gap-1'>
              <span className='text-sm'>View Cart</span>
              <FaCaretRight />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CartMobileLink;
