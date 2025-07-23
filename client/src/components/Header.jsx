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
  const { totalPrice, totalQty } = useGlobalContext();

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
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white">
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
              className="text-neutral-600 lg:hidden"
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
                    className="flex items-center gap-2 cursor-pointer bg-transparent border-none focus:outline-none"
                    aria-haspopup="true"
                    aria-expanded={openUserMenu}
                    aria-label="Account menu toggle"
                  >
                    <p>Account</p>
                    {openUserMenu ? (
                      <GoTriangleUp size={24} />
                    ) : (
                      <GoTriangleDown size={24} />
                    )}
                  </button>

                  {openUserMenu && (
                    <div className="absolute right-0 top-12">
                      <div className="bg-white shadow-lg rounded-md p-4 min-w-48">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={redirectToLoginPage}
                  className="text-lg px-2"
                  aria-label="Login"
                >
                  Login
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setOpenCartSection(true)}
                className="flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white"
                aria-label="Cart"
              >
                <div className="animate-bounce">
                  <BsCart4 size={30} />
                </div>
                <div className="font-semibold text-sm">
                  {cartItem?.length > 0 ? (
                    <div>
                      <p>{totalQty} Items</p>
                      <p>{DisplayPriceInRupees(totalPrice)}</p>
                    </div>
                  ) : (
                    <p>My Cart</p>
                  )}
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
