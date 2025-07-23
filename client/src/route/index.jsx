import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home.jsx';
import SearchPage from '../pages/SearchPage.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import ForgotPassword from '../pages/ForgotPassword.jsx';
import OtpVerification from '../pages/OtpVerification.jsx'; 
import ResetPassword from '../pages/ResetPassword.jsx'; 
import UserMenuMobile from '../pages/UserMenuMobile.jsx'; 
import Dashboard from '../layouts/Dashboard.jsx';
import Profile from '../pages/Profile.jsx'; 
import Address from '../pages/Address.jsx'; 
import MyOrders from '../pages/MyOrders.jsx';
import SubCategoryPage from '../pages/SubCategoryPage.jsx';
import UploadProduct from '../pages/UploadProduct.jsx';
import ProductAdmin from '../pages/ProductAdmin.jsx';
import CategoryPage from '../pages/CategoryPage.jsx';
import AdminPermision from '../layouts/AdminPermision.jsx';
import ProductDisplayPage from '../pages/ProductDisplayPage.jsx';
import ProductListPage from '../pages/ProductListPage.jsx';
import CartMobile from '../pages/CartMobile.jsx'
import CheckoutPage from '../pages/CheckoutPage.jsx';
import Success from '../pages/Success.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'verification-otp', element: <OtpVerification /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path : 'user', element: <UserMenuMobile /> },
      { path: 'dashboard', element: <Dashboard />, children: [
        { path: 'profile', element: <Profile /> },
        { path: 'address', element: <Address /> },
        { path: 'myorders', element: <MyOrders /> },
        { path: 'category', element: <AdminPermision><CategoryPage /></AdminPermision> },
        { path: 'subcategory', element: <AdminPermision><SubCategoryPage /></AdminPermision> },
        { path: 'upload-product', element: <AdminPermision><UploadProduct /></AdminPermision> },
        { path: 'product', element: <AdminPermision><ProductAdmin /></AdminPermision> },
      ] },
      { path :":category",
        children :[
          {
            path:":subCategory",
            element:<ProductListPage/>

          }
        ]
      },
      {
        path:"product/:id",
        element:<ProductDisplayPage/>
      },
      {
        path:'cart',
        element:<CartMobile/>
      },
      {
        path: "checkout",
        element : <CheckoutPage />
      },{
      path: "success",
      element : <Success/>
      },
    ],
  },
]);

export default router;
