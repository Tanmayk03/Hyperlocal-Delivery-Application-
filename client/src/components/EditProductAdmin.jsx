import React, { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import PropTypes from 'prop-types';

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  const [data, setData] = useState({
    _id: propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {},
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState("");
  const allCategory = useSelector(state => state.product.allCategory);
  const allSubCategory = useSelector(state => state.product.allSubCategory);

  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageLoading(true);
    try {
      const response = await uploadImage(file);
      const { data: ImageResponse } = response;
      const imageUrl = ImageResponse.data.url;

      setData(prev => ({
        ...prev,
        image: [...prev.image, imageUrl]
      }));
    } catch (error) {
      AxiosToastError(error);
    }
    setImageLoading(false);
  };

  const handleDeleteImage = (index) => {
    setData(prev => ({
      ...prev,
      image: prev.image.filter((_, idx) => idx !== index)
    }));
  };

  const handleRemoveCategory = (index) => {
    setData(prev => ({
      ...prev,
      category: prev.category.filter((_, idx) => idx !== index)
    }));
  };

  const handleRemoveSubCategory = (index) => {
    setData(prev => ({
      ...prev,
      subCategory: prev.subCategory.filter((_, idx) => idx !== index)
    }));
  };

  const handleAddField = () => {
    if (fieldName.trim() === "") return;

    setData(prev => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: ""
      }
    }));

    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: data
      });

      const { data: responseData } = response;

      if (responseData.success) {
        successAlert(responseData.message);
        if (close) close();
        fetchProductData();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className='fixed top-0 right-0 left-0 bottom-0 bg-black z-50 bg-opacity-70 p-4'>
      <div className='bg-white w-full p-4 max-w-2xl mx-auto rounded overflow-y-auto h-full max-h-[95vh]'>
        <section>
          <div className='p-2 bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Edit Product</h2>
            <button onClick={close}>
              <IoClose size={20} />
            </button>
          </div>

          <div className='grid p-3'>
            <form className='grid gap-4' onSubmit={handleSubmit}>
              {/* Product Name */}
              <div className='grid gap-1'>
                <label htmlFor='name' className='font-medium'>Name</label>
                <input
                  id='name'
                  type='text'
                  placeholder='Enter product name'
                  name='name'
                  value={data.name}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>

              {/* Description */}
              <div className='grid gap-1'>
                <label htmlFor='description' className='font-medium'>Description</label>
                <textarea
                  id='description'
                  placeholder='Enter product description'
                  name='description'
                  value={data.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none'
                />
              </div>

              {/* Image Upload */}
              <div>
                <p className='font-medium'>Image</p>
                <div>
                  <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                    <div className='text-center flex justify-center items-center flex-col'>
                      {imageLoading ? <Loading /> : <>
                        <FaCloudUploadAlt size={35} />
                        <p>Upload Image</p>
                      </>}
                    </div>
                    <input
                      type='file'
                      id='productImage'
                      className='hidden'
                      accept='image/*'
                      onChange={handleUploadImage}
                    />
                  </label>

                  <div className='flex flex-wrap gap-4 mt-2'>
                    {data.image.map((img, index) => (
                      <div key={img + index} className='h-20 w-20 min-w-20 bg-blue-50 border relative group'>
                        <button
                          type="button"
                          className="w-full h-full object-scale-down cursor-pointer bg-transparent border-none p-0 m-0"
                          onClick={() => setViewImageURL(img)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setViewImageURL(img);
                            }
                          }}
                          tabIndex={0}
                          aria-label="View image"
                        >
                          <img
                            src={img}
                            alt={img}
                            className='w-full h-full object-scale-down'
                            draggable={false}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(index)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleDeleteImage(index);
                            }
                          }}
                          className='absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-500 rounded text-white hidden group-hover:block cursor-pointer'
                          aria-label="Delete image"
                          tabIndex={0}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className='grid gap-1'>
                <label htmlFor='category' className='font-medium'>Category</label>
                <select
                  id='category'
                  className='bg-blue-50 border w-full p-2 rounded'
                  value={selectCategory}
                  onChange={(e) => {
                    const value = e.target.value;
                    const category = allCategory.find(el => el._id === value);

                    if (category && !data.category.some(c => c._id === value)) {
                      setData(prev => ({
                        ...prev,
                        category: [...prev.category, category],
                      }));
                    }
                    setSelectCategory("");
                  }}
                >
                  <option value="">Select Category</option>
                  {allCategory.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>

                <div className='flex flex-wrap gap-3 mt-2'>
                  {data.category.map((c, index) => (
                    <div key={c._id + index} className='text-sm flex items-center gap-1 bg-blue-50 p-1 rounded'>
                      <p>{c.name}</p>
                      <button
                        type="button"
                        className='hover:text-red-500 cursor-pointer bg-transparent border-none p-0 m-0'
                        onClick={() => handleRemoveCategory(index)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleRemoveCategory(index);
                          }
                        }}
                        tabIndex={0}
                        aria-label="Remove category"
                      >
                        <IoClose size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub Category */}
              <div className='grid gap-1'>
                <label htmlFor='subCategory' className='font-medium'>Sub Category</label>
                <select
                  id='subCategory'
                  className='bg-blue-50 border w-full p-2 rounded'
                  value={selectSubCategory}
                  onChange={(e) => {
                    const value = e.target.value;
                    const subCategory = allSubCategory.find(el => el._id === value);

                    if (subCategory && !data.subCategory.some(c => c._id === value)) {
                      setData(prev => ({
                        ...prev,
                        subCategory: [...prev.subCategory, subCategory]
                      }));
                    }
                    setSelectSubCategory("");
                  }}
                >
                  <option value="">Select Sub Category</option>
                  {allSubCategory.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>

                <div className='flex flex-wrap gap-3 mt-2'>
                  {data.subCategory.map((c, index) => (
                    <div key={c._id + index} className='text-sm flex items-center gap-1 bg-blue-50 p-1 rounded'>
                      <p>{c.name}</p>
                      <button
                        type="button"
                        className='hover:text-red-500 cursor-pointer bg-transparent border-none p-0 m-0'
                        onClick={() => handleRemoveSubCategory(index)}
                        aria-label="Remove subcategory"
                      >
                        <IoClose size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Fields */}
              {['unit', 'stock', 'price', 'discount'].map((field) => (
                <div key={field} className='grid gap-1'>
                  <label htmlFor={field} className='font-medium'>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    id={field}
                    type={field === 'stock' || field === 'price' || field === 'discount' ? 'number' : 'text'}
                    placeholder={`Enter product ${field}`}
                    name={field}
                    value={data[field]}
                    onChange={handleChange}
                    required
                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                  />
                </div>
              ))}

              {/* Additional Fields */}
              {Object.keys(data.more_details).map((key, index) => (
  <div key={key + index} className='grid gap-1 relative'>
    <label htmlFor={key} className='font-medium'>{key}</label>
    <input
      id={key}
      type='text'
      value={data.more_details[key]}
      onChange={(e) => {
        const value = e.target.value;
        setData(prev => ({
          ...prev,
          more_details: { ...prev.more_details, [key]: value }
        }));
      }}
      required
      className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
    />
    <button
      type="button"
      onClick={() => {
        const newDetails = { ...data.more_details };
        delete newDetails[key];
        setData(prev => ({ ...prev, more_details: newDetails }));
      }}
      className="absolute top-0 right-0 mt-1 mr-1 text-red-500 hover:text-red-700"
      aria-label={`Delete ${key} field`}
    >
      <MdDelete />
    </button>
  </div>
))}


              <button
                type="button"
                onClick={() => setOpenAddField(true)}
                className='hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded'
              >
                Add Fields
              </button>

              <button className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold'>
                Update Product
              </button>
            </form>
          </div>

          {ViewImageURL && <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />}

          {openAddField && (
            <AddFieldComponent
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              submit={handleAddField}
              close={() => setOpenAddField(false)}
            />
          )}
        </section>
      </div>
    </section>
  )
};

EditProductAdmin.propTypes = {
  close: PropTypes.func.isRequired,
  data: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.array.isRequired,
    category: PropTypes.array.isRequired,
    subCategory: PropTypes.array.isRequired,
    unit: PropTypes.string.isRequired,
    stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    discount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    description: PropTypes.string.isRequired,
    more_details: PropTypes.object,
  }).isRequired,
  fetchProductData: PropTypes.func.isRequired,
};

export default EditProductAdmin;
