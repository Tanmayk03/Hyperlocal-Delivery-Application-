import { useState } from 'react';
import logo from '../assets/logo.png';
import Search from './Search';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useMobile from '../hooks/useMobile';
import { BsCart4 } from 'react-icons/bs';
import { FaRegCircleUser } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go';
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const globalContext = useGlobalContext();
  const { totalPrice = 0, totalQty = 0 } = globalContext || {};

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openCartSection, setOpenCartSection] = useState(false);

  const redirectToLoginPage = () => navigate('/login');
  const handleCloseUserMenu = () => setOpenUserMenu(false);
  const toggleUserMenu = () => setOpenUserMenu((prev) => !prev);

  const handleMobileUser = () => {
    if (!user?._id) {
      navigate('/login');
    } else {
      navigate('/user');
    }
  };

  return (
    <header className="h-24 lg:h-20 sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200/50 transition-all duration-300">
      <div className="container mx-auto flex items-center px-2 justify-between">
        
        {/* Logo */}
        {!(isSearchPage && isMobile) && (
          <div className="h-full">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="logo"
                width={170}
                height={60}
                className="hidden lg:block"
              />
              <img
                src={logo}
                alt="logo"
                width={120}
                height={70}
                className="lg:hidden"
              />
            </Link>
          </div>
        )}

        {/* Search */}
        <div className="flex-1 px-2">
          <Search />
        </div>

        {/* Cart Section */}
        {openCartSection && (
          <DisplayCartItem close={() => setOpenCartSection(false)} />
        )}

        {/* User & Cart */}
        {!(isSearchPage && isMobile) && (
          <div>
            {/* Mobile User Icon */}
            <button
              className="text-gray-700 hover:text-gray-900 lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={handleMobileUser}
              aria-label="User Menu"
            >
              <FaRegCircleUser size={26} />
            </button>

            {/* Desktop User & Cart */}
            <div className="hidden lg:flex items-center gap-10">
              {/* User Menu */}
              {user?._id ? (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400"
                    aria-haspopup="true"
                    aria-expanded={openUserMenu}
                    aria-label="Account menu toggle"
                  >
                    <FaRegCircleUser size={18} />
                    <span className="font-medium">Account</span>
                    {openUserMenu ? (
                      <GoTriangleUp size={16} />
                    ) : (
                      <GoTriangleDown size={16} />
                    )}
                  </button>

                  {openUserMenu && (
                    <div className="absolute right-0 top-12 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="bg-white shadow-xl rounded-xl p-2 min-w-48 border border-gray-100">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={redirectToLoginPage}
                  className="px-6 py-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors rounded-lg hover:bg-gray-100"
                  aria-label="Login"
                >
                  Login
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setOpenCartSection(true)}
                className="relative flex items-center gap-2 bg-gray-800 hover:bg-gray-900 px-4 py-2 rounded-xl text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                aria-label="Cart"
              >
                <BsCart4 size={22} />
                <div className="font-semibold text-sm">
                  {cartItem?.length > 0 ? (
                    <div>
                      <p className="leading-tight">{totalQty} Items</p>
                      <p className="text-xs opacity-90">{DisplayPriceInRupees(totalPrice)}</p>
                    </div>
                  ) : (
                    <p>My Cart</p>
                  )}
                </div>
                {cartItem?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalQty}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
