import React from 'react';
import banner from '../assets/banner.jpg';
import bannerMobile from '../assets/banner-mobile.jpg';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { valideURLConvert } from '../utils/valideURLConvert';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory);
  const categoryData = useSelector(state => state.product.allCategory);
  const subCategoryData = useSelector(state => state.product.allSubCategory);
  const navigate = useNavigate();

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find(sub =>
      sub.category.some(c => c._id === id)
    );

    if (!subcategory) return;

    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
    navigate(url);
  };

  return (
    <section className='bg-white'>
      {/* Banner */}
      <div className='container mx-auto'>
        <div className={`w-full h-full min-h-48 bg-blue-100 rounded ${!banner && 'animate-pulse my-2'}`}>
          <img
            src={banner}
            className='w-full h-full hidden lg:block'
            alt='Desktop banner'
          />
          <img
            src={bannerMobile}
            className='w-full h-full lg:hidden'
            alt='Mobile banner'
          />
        </div>
      </div>

      {/* Category Grid */}
      <div className='container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2'>
        {loadingCategory ? (
          new Array(12).fill(null).map((_, index) => (
            <div
              key={index + 'loadingcategory'}
              className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'
            >
              <div className='bg-blue-100 min-h-24 rounded'></div>
              <div className='bg-blue-100 h-8 rounded'></div>
            </div>
          ))
        ) : (
          categoryData.map(cat => (
            <button
              key={cat._id + 'displayCategory'}
              onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
              className='w-full h-full bg-white rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
              type='button'
            >
              <img
                src={cat.image}
                alt={cat.name}
                className='w-full h-full object-scale-down'
              />
            </button>
          ))
        )}
      </div>

      {/* Category-wise Products */}
      {categoryData?.map(c => (
        <CategoryWiseProductDisplay
          key={c?._id + 'CategorywiseProduct'}
          id={c?._id}
          name={c?.name}
        />
      ))}
    </section>
  );
};

export default Home;
