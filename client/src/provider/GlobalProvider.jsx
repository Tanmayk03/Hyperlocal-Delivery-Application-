import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContext = createContext(null);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children, someProp }) => {
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);

  const cartItem = useSelector((state) => state?.cartItem?.cart || []);
  const user = useSelector((state) => state?.user);

  const fetchCartItem = useCallback(async () => {
    try {
      const response = await Axios(SummaryApi.getCartItem);
      const { data: responseData } = response;

      if (responseData?.success) {
        dispatch(handleAddItemCart(responseData.data));
      }
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  const updateCartItem = useCallback(async (id, qty) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        data: { _id: id, qty },
      });
      const { data: responseData } = response;

      if (responseData?.success) {
        await fetchCartItem();
        return responseData;
      }
    } catch (error) {
      AxiosToastError(error);
      return error;
    }
  }, [fetchCartItem]);

  const deleteCartItem = useCallback(async (cartId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        data: { _id: cartId },
      });
      const { data: responseData } = response;

      if (responseData?.success) {
        toast.success(responseData.message);
        fetchCartItem();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  }, [fetchCartItem]);

  useEffect(() => {
    const qty = cartItem.reduce((sum, item) => sum + item.quantity, 0);
    setTotalQty(qty);

    const discountedTotal = cartItem.reduce((sum, item) => {
      const price = pricewithDiscount(
        item?.productId?.price,
        item?.productId?.discount
      );
      return sum + price * item.quantity;
    }, 0);
    setTotalPrice(discountedTotal);

    const originalTotal = cartItem.reduce(
      (sum, item) => sum + item?.productId?.price * item.quantity,
      0
    );
    setNotDiscountTotalPrice(originalTotal);
  }, [cartItem]);

  const handleLogoutOut = useCallback(() => {
    localStorage.clear();
    dispatch(handleAddItemCart([]));
  }, [dispatch]);

  const fetchAddress = useCallback(async () => {
    try {
      const response = await Axios(SummaryApi.getAddress);
      const { data: responseData } = response;
      if (responseData?.success) {
        dispatch(handleAddAddress(responseData.data));
      }
    } catch (error) {
      // Optional silent catch
    }
  }, [dispatch]);

  const fetchOrder = useCallback(async () => {
    try {
      const response = await Axios(SummaryApi.getOrderItems);
      const { data: responseData } = response;

      if (responseData?.success) {
        dispatch(setOrder(responseData.data));
      }
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCartItem();
    fetchAddress();
    fetchOrder();
  }, [user, fetchCartItem, fetchAddress, fetchOrder]);

  // Memoize context value
  const contextValue = useMemo(() => ({
    fetchCartItem,
    updateCartItem,
    deleteCartItem,
    fetchAddress,
    fetchOrder,
    totalPrice,
    totalQty,
    notDiscountTotalPrice,
    handleLogoutOut,
    someProp,
  }), [
    fetchCartItem,
    updateCartItem,
    deleteCartItem,
    fetchAddress,
    fetchOrder,
    totalPrice,
    totalQty,
    notDiscountTotalPrice,
    handleLogoutOut,
    someProp,
  ]);

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

GlobalProvider.propTypes = {
  children: PropTypes.node.isRequired,
  someProp: PropTypes.any,
};

export default GlobalProvider;
