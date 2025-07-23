import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';

const Product = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // for disabling Next if no more products

  const fetchProductData = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: { page },
      });

      const responseData = response?.data;
      console.log("Product page response:", responseData);

      if (responseData?.success) {
        setProductData(responseData.data);
        setHasMore(responseData.data?.length > 0); // if no items, disable "Next"
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [page]);

  const handleNext = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Product List (Page {page})</h2>

      <ul className="space-y-2 mb-4">
        {productData?.map((item, index) => (
          <li key={item?._id || index} className="border p-2 rounded shadow">
            <p className="font-medium">{item?.name || 'No Name'}</p>
            <p className="text-sm text-gray-500">Price: ₹{item?.price || 'N/A'}</p>
          </li>
        ))}
        {productData?.length === 0 && (
          <li className="text-center text-gray-500">No products found.</li>
        )}
      </ul>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className={`px-4 py-1 rounded ${
            page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'
          }`}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!hasMore}
          className={`px-4 py-1 rounded ${
            !hasMore ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Product;
