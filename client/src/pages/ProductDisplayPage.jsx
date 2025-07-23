import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'

const ProductDisplayPage = () => {
  const params = useParams()
  const rawId = params?.id || ''
const productId = rawId.split('-').slice(-1)[0]  // Extract last part as MongoDB ObjectId


  const [data, setData] = useState({
    name: '',
    image: [],
    description: '',
    unit: '',
    discount: 0,
    price: 0,
    stock: 0,
    more_details: {},
  })

  const [imageIndex, setImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const imageContainer = useRef()

  const fetchProductDetails = async () => {
    setLoading(true)
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId,
        },
      })

      const { data: responseData } = response

      if (responseData.success && responseData.data) {
        setData(responseData.data)
      } else {
        setData({
          name: '',
          image: [],
          description: '',
          unit: '',
          discount: 0,
          price: 0,
          stock: 0,
          more_details: {},
        })
      }
    } catch (error) {
      AxiosToastError(error)
      setData({
        name: '',
        image: [],
        description: '',
        unit: '',
        discount: 0,
        price: 0,
        stock: 0,
        more_details: {},
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      console.log('Fetching product details for ID:', productId)
      fetchProductDetails()
    } else {
      setLoading(false)
    }
  }, [productId])

  const handleScrollRight = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft += 100
    }
  }
  const handleScrollLeft = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft -= 100
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <p>Loading product details...</p>
      </div>
    )
  }

  if (!data.name) {
    return (
      <div className="text-center py-20 text-red-500">
        <p>Product not found.</p>
      </div>
    )
  }

  return (
    <section className="container mx-auto p-4 grid lg:grid-cols-2 gap-6">
      <div>
        {Array.isArray(data.image) && data.image.length > 0 ? (
          <>
            <div className="bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full">
              <img
                src={data.image[imageIndex]}
                alt={data.name}
                className="w-full h-full object-scale-down"
              />
            </div>
            <div className="flex items-center justify-center gap-3 my-2">
              {data.image.map((img, index) => (
                <div
                  key={img + index + 'point'}
                  className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full cursor-pointer ${
                    index === imageIndex ? 'bg-slate-400' : ''
                  }`}
                  onClick={() => setImageIndex(index)}
                  aria-label={`Select image ${index + 1}`}
                ></div>
              ))}
            </div>
            <div className="grid relative">
              <div
                ref={imageContainer}
                className="flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none"
              >
                {data.image.map((img, index) => (
                  <div
                    className="w-20 h-20 min-h-20 min-w-20 cursor-pointer shadow-md"
                    key={img + index}
                    onClick={() => setImageIndex(index)}
                    aria-label={`Thumbnail image ${index + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${data.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-scale-down"
                    />
                  </div>
                ))}
              </div>
              <div className="w-full -ml-3 h-full hidden lg:flex justify-between absolute items-center">
                <button
                  onClick={handleScrollLeft}
                  className="z-10 bg-white relative p-1 rounded-full shadow-lg"
                  aria-label="Scroll images left"
                >
                  <FaAngleLeft />
                </button>
                <button
                  onClick={handleScrollRight}
                  className="z-10 bg-white relative p-1 rounded-full shadow-lg"
                  aria-label="Scroll images right"
                >
                  <FaAngleRight />
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center py-20 text-gray-500">No images available</p>
        )}

        <div className="my-4 hidden lg:grid gap-3">
          <div>
            <p className="font-semibold">Description</p>
            <p className="text-base">{data.description}</p>
          </div>
          <div>
            <p className="font-semibold">Unit</p>
            <p className="text-base">{data.unit}</p>
          </div>
          {data?.more_details &&
            Object.keys(data.more_details).map((key) => (
              <div key={key}>
                <p className="font-semibold">{key}</p>
                <p className="text-base">{data.more_details[key]}</p>
              </div>
            ))}
        </div>
      </div>

      <div className="p-4 lg:pl-7 text-base lg:text-lg">
        <p className="bg-green-300 w-fit px-2 rounded-full">10 Min</p>
        <h2 className="text-lg font-semibold lg:text-3xl">{data.name}</h2>
        <p>{data.unit}</p>
        <Divider />
        <div>
          <p>Price</p>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="border border-green-600 px-4 py-2 rounded bg-green-50 w-fit">
              <p className="font-semibold text-lg lg:text-xl">
                {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
              </p>
            </div>
            {data.discount > 0 && (
              <>
                <p className="line-through">{DisplayPriceInRupees(data.price)}</p>
                <p className="font-bold text-green-600 lg:text-2xl">
                  {data.discount}% <span className="text-base text-neutral-500">Discount</span>
                </p>
              </>
            )}
          </div>
        </div>

        {data.stock === 0 ? (
          <p className="text-lg text-red-500 my-2">Out of Stock</p>
        ) : (
          <div className="my-4">
            <AddToCartButton data={data} />
          </div>
        )}

        <h2 className="font-semibold">Why shop from binkeyit?</h2>
        <div>
          <div className="flex items-center gap-4 my-4">
            <img src={image1} alt="superfast delivery" className="w-20 h-20" />
            <div className="text-sm">
              <div className="font-semibold">Superfast Delivery</div>
              <p>Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 my-4">
            <img src={image2} alt="Best prices offers" className="w-20 h-20" />
            <div className="text-sm">
              <div className="font-semibold">Best Prices & Offers</div>
              <p>Best price destination with offers directly from the manufacturers.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 my-4">
            <img src={image3} alt="Wide Assortment" className="w-20 h-20" />
            <div className="text-sm">
              <div className="font-semibold">Wide Assortment</div>
              <p>Choose from 5000+ products across food, personal care, household & other categories.</p>
            </div>
          </div>
        </div>

        {/* Only mobile */}
        <div className="my-4 grid gap-3 lg:hidden">
          <div>
            <p className="font-semibold">Description</p>
            <p className="text-base">{data.description}</p>
          </div>
          <div>
            <p className="font-semibold">Unit</p>
            <p className="text-base">{data.unit}</p>
          </div>
          {data?.more_details &&
            Object.keys(data.more_details).map((key) => (
              <div key={key}>
                <p className="font-semibold">{key}</p>
                <p className="text-base">{data.more_details[key]}</p>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export default ProductDisplayPage
