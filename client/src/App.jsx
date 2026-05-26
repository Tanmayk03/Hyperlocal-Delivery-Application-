import { Outlet, useLocation } from 'react-router-dom'; // ✅ Fix here
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setUserDetails } from './store/userSlice';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlice';

import fetchUserDetails from './utils/fetchUserDetails';
import Axios from './utils/Axios.js';
import SummaryApi from './common/SummaryApi.js';
import GlobalProvider from './provider/GlobalProvider.jsx';
import CartMobileLink from './components/CartMobile.jsx';

export default function App() {
  const dispatch = useDispatch();
  const location = useLocation(); // ✅ Fix here

  const fetchUser = async () => {
    try {
      const userData = await fetchUserDetails();
      if (userData?.data?._id) {
        dispatch(setUserDetails(userData.data));
      }
      // Silently handle case when user is not logged in
    } catch (error) {
      // Only log unexpected errors (not connection errors or 401)
      if (error.response?.status !== 401 && error.code !== 'ERR_NETWORK') {
        console.error("Failed to fetch user:", error);
      }
    }
  };

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const axiosResponse = await Axios({ ...SummaryApi.getCategory });
      const responseData = axiosResponse?.data;

      if (responseData?.success) {
        dispatch(setAllCategory(responseData.data));
      }
    } catch (error) {
      // Only log non-connection errors
      if (error.code !== 'ERR_NETWORK') {
        console.error("Failed to fetch categories:", error);
      }
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  const fetchSubCategory = async () => {
    try {
      const axiosResponse = await Axios({ ...SummaryApi.getSubCategory });
      const responseData = axiosResponse?.data;

      if (responseData?.success) {
        dispatch(setAllSubCategory(responseData.data));
      }
    } catch (error) {
      // Only log non-connection errors
      if (error.code !== 'ERR_NETWORK') {
        console.error("Failed to fetch subcategories:", error);
      }
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);


  return (
    <GlobalProvider> 
      <Header/>
      <main className='min-h-[78vh]'>
        <Outlet/>
      </main>
      <Footer/>
      <Toaster/>
      {
        location.pathname !== '/checkout' && (
          <CartMobileLink/>
        )
      }
    </GlobalProvider>
  );
}
