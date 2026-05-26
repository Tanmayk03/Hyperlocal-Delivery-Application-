import React from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({data}) => {
    const url = `/product/${valideURLConvert(data.name)}-${data._id}`
    const [loading,setLoading] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    React.useEffect(() => {
      if (!isHovered || !data?.image || data.image.length <= 1) return;

      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % data.image.length);
      }, 1500);

      return () => clearInterval(interval);
    }, [isHovered, data?.image]);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setCurrentImageIndex(0);
    };
  
  return (
    <Link 
      to={url} 
      className='group border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white transition-all duration-300 hover:shadow-md hover:border-gray-300'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className='min-h-20 w-full h-24 lg:h-32 rounded overflow-hidden relative flex items-center justify-center bg-white'>
        {Array.isArray(data?.image) && data.image.length > 0 ? (
          data.image.map((imgUrl, idx) => (
            <img 
              key={idx}
              src={imgUrl}
              alt={data.name}
              className={`absolute w-full h-full object-scale-down lg:scale-110 transition-opacity duration-500 ease-in-out ${
                idx === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            />
          ))
        ) : (
          <div className="bg-gray-100 w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
        )}

        {/* Pager Dots */}
        {Array.isArray(data?.image) && data.image.length > 1 && isHovered && (
          <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1 z-20 transition-all duration-300 bg-white/20 backdrop-blur-[1px] py-1 max-w-[60%] mx-auto rounded-full">
            {data.image.map((_, idx) => (
              <span 
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex ? 'bg-green-600 scale-125' : 'bg-gray-350/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className='flex items-center gap-2 flex-wrap'>
        <div className='rounded-full text-xs w-fit px-2 py-1 text-gray-600 bg-gray-100 font-medium'>
              10 min 
        </div>
        <div>
            {
              Boolean(data.discount) && (
                <p className='text-red-600 bg-red-100 px-2 py-1 w-fit text-xs rounded-full font-semibold'>{data.discount}% OFF</p>
              )
            }
        </div>
      </div>
      <div className='px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2'>
        {data.name}
      </div>
      <div className='w-fit gap-1 px-2 lg:px-0 text-sm lg:text-base'>
        {data.unit} 
        
      </div>

      <div className='px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base'>
        <div className='flex items-center gap-1'>
          <div className='font-semibold'>
              {DisplayPriceInRupees(pricewithDiscount(data.price,data.discount))} 
          </div>
          
          
        </div>
        <div className=''>
          {
            data.stock == 0 ? (
              <p className='text-red-500 text-sm text-center'>Out of stock</p>
            ) : (
              <AddToCartButton data={data} />
            )
          }
            
        </div>
      </div>

    </Link>
  )
}

export default CardProduct