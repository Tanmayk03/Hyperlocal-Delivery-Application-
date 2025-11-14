import React from 'react';
import bannerr from '../assets/bannerr.png';
import bannerMobile from '../assets/banner-mobile.jpg';
import bannerMobilee from '../assets/bannerMobile.png';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { valideURLConvert } from '../utils/valideURLConvert';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';

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
        <div
          className={`relative w-full rounded-2xl overflow-hidden shadow-lg ${
            !bannerr && "animate-pulse"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/5 to-transparent z-10"></div>
          
          <img
            src={bannerr}
            alt="Desktop banner"
            className="hidden lg:block w-full h-auto max-h-[320px] object-cover object-center relative"
          />

          <img
            src={bannerMobilee || bannerr}
            alt="Mobile banner"
            className="block lg:hidden w-full h-[180px] sm:h-[220px] object-cover object-center relative"
          />
        </div>
      </div>

      {/* Compact Category Section */}
      <div className='container mx-auto px-4 py-6'>
        {/* Minimal Section Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              Shop by Category
            </h2>
            <p className="text-sm text-slate-500">
              Best deals on all categories
            </p>
          </div>
          {!loadingCategory && categoryData.length > 16 && (
            <button 
              onClick={handleToggleCategories}
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 transition-all"
            >
              {showAllCategories ? 'Show Less' : 'See All'}
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${showAllCategories ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* First Row - 8 Categories */}
        <div className='grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-3'>
          {loadingCategory ? (
            new Array(8).fill(null).map((_, index) => (
              <div
                key={index + 'loadingcategory'}
                className='bg-slate-50 rounded-xl p-3 min-h-40 flex flex-col items-center justify-center gap-2 animate-pulse border border-slate-100'
              >
                <div className='bg-slate-200 w-20 h-20 rounded-lg'></div>
                <div className='bg-slate-200 h-3 w-16 rounded'></div>
              </div>
            ))
          ) : (
            categoryData.slice(0, 8).map((cat) => (
              <button
                key={cat._id + 'displayCategory'}
                onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                className='group w-full bg-white rounded-xl p-3 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-slate-300 border border-slate-100 hover:border-slate-200'
                type='button'
              >
                {/* Image Container */}
                <div className='bg-slate-50 rounded-lg p-3 mb-2 group-hover:bg-slate-100 transition-colors duration-300 flex items-center justify-center h-28'>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className='w-full h-full object-contain transition-transform duration-300 group-hover:scale-110'
                  />
                </div>
                
                {/* Category Name */}
                <p className='text-xs font-medium text-slate-700 text-center line-clamp-2 group-hover:text-slate-900 transition-colors leading-tight min-h-[2rem] flex items-center justify-center'>
                  {cat.name}
                </p>
              </button>
            ))
          )}
        </div>

        {/* Second Row - Next 8 Categories */}
        {!loadingCategory && categoryData.length > 8 && (
          <div className='grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3'>
            {categoryData.slice(8, 16).map((cat) => (
              <button
                key={cat._id + 'displayCategory2'}
                onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                className='group w-full bg-white rounded-xl p-3 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-slate-300 border border-slate-100 hover:border-slate-200'
                type='button'
              >
                {/* Image Container */}
                <div className='bg-slate-50 rounded-lg p-3 mb-2 group-hover:bg-slate-100 transition-colors duration-300 flex items-center justify-center h-28'>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className='w-full h-full object-contain transition-transform duration-300 group-hover:scale-110'
                  />
                </div>
                
                {/* Category Name */}
                <p className='text-xs font-medium text-slate-700 text-center line-clamp-2 group-hover:text-slate-900 transition-colors leading-tight min-h-[2rem] flex items-center justify-center'>
                  {cat.name}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Expandable Section - Remaining Categories */}
        {!loadingCategory && categoryData.length > 16 && (
          <div 
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              showAllCategories ? 'max-h-[2000px] opacity-100 mt-3' : 'max-h-0 opacity-0'
            }`}
          >
            <div className='grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3'>
              {categoryData.slice(16).map((cat, index) => (
                <button
                  key={cat._id + 'displayCategoryExtra'}
                  onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                  className='group w-full bg-white rounded-xl p-3 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-slate-300 border border-slate-100 hover:border-slate-200'
                  type='button'
                  style={{
                    animation: showAllCategories ? `slideUp 0.3s ease-out ${index * 0.03}s both` : 'none'
                  }}
                >
                  {/* Image Container */}
                  <div className='bg-slate-50 rounded-lg p-3 mb-2 group-hover:bg-slate-100 transition-colors duration-300 flex items-center justify-center h-28'>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className='w-full h-full object-contain transition-transform duration-300 group-hover:scale-110'
                    />
                  </div>
                  
                  {/* Category Name */}
                  <p className='text-xs font-medium text-slate-700 text-center line-clamp-2 group-hover:text-slate-900 transition-colors leading-tight min-h-[2rem] flex items-center justify-center'>
                    {cat.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
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