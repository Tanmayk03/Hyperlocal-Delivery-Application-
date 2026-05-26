import React from 'react';
import desktopBanner from '../assets/new_desktop_banner.png';
import mobileBanner from '../assets/new_mobile_banner.png';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { valideURLConvert } from '../utils/valideURLConvert';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import RecipeKits from '../components/RecipeKits';

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory);
  const categoryData = useSelector(state => state.product.allCategory);
  const subCategoryData = useSelector(state => state.product.allSubCategory);
  const navigate = useNavigate();
  const [showAllCategories, setShowAllCategories] = React.useState(false);

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find(sub =>
      sub.category.some(c => c._id === id)
    );

    if (!subcategory) return;

    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
    navigate(url);
  };

  const handleToggleCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  return (
    <section className='bg-white'>
      {/* Hero Banner */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => {
            const el = document.getElementById('CategorywiseProduct') || document.querySelector('section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-full rounded-3xl overflow-hidden shadow-xl border border-slate-100/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.005] cursor-pointer bg-slate-50 relative block focus:outline-none"
        >
          {/* Desktop Banner */}
          <img
            src={desktopBanner}
            alt="Promotional Banner"
            className="hidden lg:block w-full h-auto block"
          />
          {/* Mobile/Tablet Banner */}
          <img
            src={mobileBanner}
            alt="Promotional Banner"
            className="block lg:hidden w-full h-auto block"
          />
        </button>
      </div>

      {/* Compact Category Section */}
      <div className='container mx-auto px-4 py-8'>
        {/* Minimal Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Premium quality essentials delivered in 10 minutes
            </p>
          </div>
          {!loadingCategory && categoryData.length > 16 && (
            <button 
              onClick={handleToggleCategories}
              className="text-xs font-bold text-green-600 hover:text-green-700 inline-flex items-center gap-1.5 transition-all bg-green-50 hover:bg-green-100/80 px-3 py-1.5 rounded-xl cursor-pointer"
            >
              {showAllCategories ? 'Show Less' : 'See All'}
              <svg 
                className={`w-3.5 h-3.5 transition-transform duration-300 ${showAllCategories ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Unified Category Grid */}
        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4'>
          {loadingCategory ? (
            new Array(8).fill(null).map((_, index) => (
              <div
                key={index + 'loadingcategory'}
                className='bg-slate-50 rounded-2xl p-4 min-h-[160px] flex flex-col items-center justify-center gap-3 animate-pulse border border-slate-100/50'
              >
                <div className='bg-slate-200 w-16 h-16 rounded-full'></div>
                <div className='bg-slate-200 h-3 w-16 rounded'></div>
              </div>
            ))
          ) : (
            categoryData.slice(0, showAllCategories ? undefined : 16).map((cat, index) => (
              <button
                key={cat._id + 'displayCategory'}
                onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                className='group w-full bg-slate-50/30 hover:bg-white rounded-2xl p-4 transition-all duration-500 transform hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-green-500/30 border border-slate-100/60 hover:border-green-200 hover:shadow-[0_20px_35px_-10px_rgba(22,163,74,0.12)] flex flex-col items-center justify-between min-h-[165px] relative overflow-hidden select-none cursor-pointer'
                type='button'
                style={{
                  animation: `slideUp 0.4s ease-out ${index * 0.02}s both`
                }}
              >
                {/* Micro badge for top 3 categories */}
                {index < 3 && (
                  <span className="absolute top-2 right-2 bg-gradient-to-r from-green-600 to-emerald-600 text-[8px] font-black text-white px-1.5 py-0.5 rounded-md tracking-wider uppercase scale-90">
                    Fresh
                  </span>
                )}

                {/* Circular image glow backdrop */}
                <div className='w-20 h-20 flex items-center justify-center mb-3 relative rounded-full overflow-hidden'>
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-emerald-500/5 rounded-full scale-90 group-hover:scale-110 transition-transform duration-500"></div>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className='w-16 h-16 object-contain relative z-10 transition-transform duration-500 group-hover:scale-115'
                  />
                </div>
                
                {/* Category Name */}
                <p className='text-[10px] font-extrabold text-slate-700 text-center line-clamp-2 group-hover:text-green-700 transition-colors leading-tight min-h-[2rem] flex items-center justify-center px-0.5 tracking-wide uppercase'>
                  {cat.name}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Add CSS Animation */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Recipe Kits Section */}
      <RecipeKits />

      {/* Category-wise Products */}
      <div className="bg-slate-50 py-8 mt-6">
        {categoryData?.map((c, index) => (
          <div key={c?._id + 'CategorywiseProduct'} className={index > 0 ? 'mt-10' : ''}>
            <CategoryWiseProductDisplay
              id={c?._id}
              name={c?.name}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home;