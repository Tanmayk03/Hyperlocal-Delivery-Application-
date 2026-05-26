import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import RiderMap from '../components/RiderMap';
import { FaCheckCircle } from 'react-icons/fa';

const Success = () => {
  const location = useLocation();
  const message = location?.state?.text || "Payment";

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-6 shadow-xl flex flex-col justify-center items-center gap-6">
        
        {/* Animated Check Circle */}
        <div className="text-green-500 animate-bounce">
          <FaCheckCircle size={56} />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-800">Order Placed!</h2>
          <p className="text-sm text-slate-500 mt-1">
            {message === 'Order' ? 'Your order has been received' : `${message} processed successfully`}
          </p>
        </div>

        <Link
          to="/"
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-green-500/20 transition-all text-sm w-full text-center"
        >
          Go To Home
        </Link>
      </div>

      {/* Live Rider Map simulator */}
      <div className="w-full max-w-lg">
        <RiderMap />
      </div>
    </div>
  );
};

export default Success;
