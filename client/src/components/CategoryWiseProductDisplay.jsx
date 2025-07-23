import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6"
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import PropTypes from 'prop-types'

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef()
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const loadingCardNumber = new Array(6).fill(null)

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: id
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryWiseProduct()
  }, [])

  const handleScrollRight = () => {
    containerRef.current.scrollLeft += 200
  }

  const handleScrollLeft = () => {
    containerRef.current.scrollLeft -= 200
  }

  const handleRedirectProductListpage = () => {
    const subcategory = subCategoryData.find(sub => {
      return sub.category.some(c => c._id === id)
    })

    if (!subcategory) return '#'

    const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`
    return url
  }

  const redirectURL = handleRedirectProductListpage()

  return (
    <div>
      <div className='container mx-auto p-4 flex items-center justify-between gap-4'>
        <h3 className='font-semibold text-lg md:text-xl'>{name}</h3>
        <Link to={redirectURL} className='text-green-600 hover:text-green-400'>See All</Link>
      </div>

      <div className='relative flex items-center '>
        <div
          className='flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth'
          ref={containerRef}
        >
          {loading &&
            loadingCardNumber.map((_, index) => (
              <CardLoading key={"CategorywiseProductDisplayLoading" + index} />
            ))
          }

          {data.map((p, index) => (
            <CardProduct
              data={p}
              key={p._id + "CategorywiseProductDisplay" + index}
            />
          ))}
        </div>

        {/* Scroll buttons */}
        <div className='w-full left-0 right-0 container mx-auto px-2 absolute hidden lg:flex justify-between'>
          <button onClick={handleScrollLeft} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full' type='button'>
            <FaAngleLeft />
          </button>
          <button onClick={handleScrollRight} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full' type='button'>
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  )
}

// ✅ PropTypes validation to fix SonarQube S6774
CategoryWiseProductDisplay.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

export default CategoryWiseProductDisplay
