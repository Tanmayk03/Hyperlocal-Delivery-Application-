import React, { useState } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import AddAddress from '../components/AddAddress';
import { useSelector } from 'react-redux';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // Load once

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector(state => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState(0);
  const cartItemsList = useSelector(state => state.cartItem.cart);
  const navigate = useNavigate();

  const handleCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchCartItem?.();
        fetchOrder?.();
        navigate('/success', { state: { text: 'Order' } });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleOnlinePayment = async () => {
    const toastId = toast.loading('Redirecting to payment...');
    try {
      const stripe = await stripePromise;

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      });

      const { data } = response;

      toast.dismiss(toastId);

      if (!stripe || !data.id) {
        return toast.error("Stripe initialization failed.");
      }

      const result = await stripe.redirectToCheckout({ sessionId: data.id });

      if (result.error) {
        toast.error(result.error.message);
      }

      fetchCartItem?.();
      fetchOrder?.();
    } catch (error) {
      toast.dismiss(toastId);
      AxiosToastError(error);
    }
  };

  return (
    <section className="bg-blue-50">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-5">
        <div className="w-full">
          <h3 className="text-lg font-semibold">Choose your address</h3>
          <div className="bg-white p-2 grid gap-4">
            {addressList.map((address, index) => (
              address.status && (
                <label
                  key={address._id || index}
                  htmlFor={`address${index}`}
                  className="cursor-pointer"
                >
                  <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
                    <input
                      id={`address${index}`}
                      type="radio"
                      value={index}
                      onChange={(e) => setSelectAddress(Number(e.target.value))}
                      name="address"
                      checked={+selectAddress === index}
                    />
                    <div>
                      <p>{address.address_line}</p>
                      <p>{address.city}, {address.state}</p>
                      <p>{address.country} - {address.pincode}</p>
                      <p>{address.mobile}</p>
                    </div>
                  </div>
                </label>
              )
            ))}

            <button
              type="button"
              onClick={() => setOpenAddress(true)}
              className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer"
            >
              Add Address
            </button>
          </div>
        </div>

        <div className="w-full max-w-md bg-white py-4 px-2">
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="p-4">
            <h3 className="font-semibold">Bill details</h3>
            <div className="flex justify-between ml-1">
              <p>Items total</p>
              <p className="flex gap-2">
                <span className="line-through text-neutral-400">{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                <span>{DisplayPriceInRupees(totalPrice)}</span>
              </p>
            </div>
            <div className="flex justify-between ml-1">
              <p>Quantity</p>
              <p>{totalQty} item</p>
            </div>
            <div className="flex justify-between ml-1">
              <p>Delivery</p>
              <p>Free</p>
            </div>
            <div className="font-semibold flex justify-between ml-1">
              <p>Grand Total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <button
              type="button"
              className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
              onClick={handleOnlinePayment}
            >
              Online Payment
            </button>
            <button
              type="button"
              className="py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white"
              onClick={handleCashOnDelivery}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;
