import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { Link, useParams } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const params = useParams()

  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [displaySubCategory, setDisplaySubCategory] = useState([])

  // Extract IDs
  const categoryId = params.category?.split('-').slice(-1)[0]
  const subCategoryId = params.subCategory?.split('-').slice(-1)[0]

  // Display name (removes ID part from slug)
  const subCategory = params?.subCategory?.split('-')
  const subCategoryName = subCategory?.slice(0, subCategory.length - 1).join(' ')

  const fetchProductdata = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId,
          subCategoryId,
          page: 1,
          limit: 8,
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
    if (categoryId && subCategoryId) {
      fetchProductdata()
    }
  }, [params])

  useEffect(() => {
    const sub = AllSubCategory.filter(s => {
      return s.category.some(c => c._id === categoryId)
    })
    setDisplaySubCategory(sub)
  }, [params, AllSubCategory, categoryId])

  return (
    <section className='sticky top-24 lg:top-20'>
      <div className='container mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]'>

        {/* Left Side Sub Categories */}
        <div className='min-h-[88vh] max-h-[88vh] overflow-y-scroll grid gap-1 shadow-md scrollbarCustom bg-white py-2'>
          {
            displaySubCategory.map((s, index) => {
              const link = `/${valideURLConvert(s.category[0]?.name)}-${s.category[0]?._id}/${valideURLConvert(s.name)}-${s._id}`
              return (
                <Link
                  key={s._id + "subCategory" + index}
                  to={link}
                  className={`w-full p-2 lg:flex items-center lg:gap-4 border-b hover:bg-green-100 cursor-pointer
                    ${subCategoryId === s._id ? "bg-green-100" : ""}`}
                >
                  <div className='w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded'>
                    <img
                      src={s.image}
                      alt='subCategory'
                      className='w-14 h-14 object-contain'
                    />
                  </div>
                  <p className='-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base'>
                    {s.name}
                  </p>
                </Link>
              )
            })
          }
        </div>

        {/* Right Side Product Display */}
        <div className='sticky top-20'>
          <div className='bg-white shadow-md p-4 z-10'>
            <h3 className='font-semibold capitalize'>{subCategoryName}</h3>
          </div>

          <div className='min-h-[80vh] max-h-[80vh] overflow-y-auto relative'>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4'>
              {
                data.map((p, index) => (
                  <CardProduct
                    key={p._id + "productSubCategory" + index}
                    data={p}
                  />
                ))
              }
            </div>

            {loading && <Loading />}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductListPage
