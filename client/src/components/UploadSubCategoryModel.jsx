import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import PropTypes from 'prop-types';

const UploadSubCategoryModel = ({ close, fetchData }) => {
    const [subCategoryData, setSubCategoryData] = useState({
        name: "",
        image: "",
        category: []
    });

    const [allCategory, setAllCategory] = useState([]);

    useEffect(() => {
        const fetchCategoryList = async () => {
            try {
                const response = await Axios(SummaryApi.getCategory);
                const { data: responseData } = response;

                if (responseData.success) {
                    setAllCategory(responseData.data || []);
                }
            } catch (error) {
                AxiosToastError(error);
            }
        };

        fetchCategoryList();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSubCategoryData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUploadSubCategoryImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const response = await uploadImage(file);
        const { data: ImageResponse } = response;

        setSubCategoryData((prev) => ({
            ...prev,
            image: ImageResponse.data.url
        }));
    };

    const handleRemoveCategorySelected = (categoryId) => {
        const filtered = subCategoryData.category.filter(cat => cat._id !== categoryId);
        setSubCategoryData((prev) => ({
            ...prev,
            category: filtered
        }));
    };

    const handleSubmitSubCategory = async (e) => {
        e.preventDefault();

        try {
            const response = await Axios({
                ...SummaryApi.createSubCategory,
                data: subCategoryData
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                if (close) close();
                if (fetchData) fetchData();
            }

        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className='fixed top-0 right-0 bottom-0 left-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-5xl bg-white p-4 rounded'>
                <div className='flex items-center justify-between gap-3'>
                    <h1 className='font-semibold'>Add Sub Category</h1>
                    <button onClick={close}>
                        <IoClose size={25} />
                    </button>
                </div>
                <form className='my-3 grid gap-3' onSubmit={handleSubmitSubCategory}>
                    <div className='grid gap-1'>
                        <label htmlFor='name'>Name</label>
                        <input
                            id='name'
                            name='name'
                            value={subCategoryData.name}
                            onChange={handleChange}
                            className='p-3 bg-blue-50 border outline-none focus-within:border-primary-200 rounded'
                        />
                    </div>
                    <div className='grid gap-1'>
                        <p>Image</p>
                        <div className='flex flex-col lg:flex-row items-center gap-3'>
                            <div className='border h-36 w-full lg:w-36 bg-blue-50 flex items-center justify-center'>
                                {!subCategoryData.image ? (
                                    <p className='text-sm text-neutral-400'>No Image</p>
                                ) : (
                                    <img
                                        alt='subCategory'
                                        src={subCategoryData.image}
                                        className='w-full h-full object-scale-down'
                                    />
                                )}
                            </div>
                            <label htmlFor='uploadSubCategoryImage'>
                                <div className='px-4 py-1 border border-primary-100 text-primary-200 rounded hover:bg-primary-200 hover:text-neutral-900 cursor-pointer'>
                                    Upload Image
                                </div>
                                <input
                                    type='file'
                                    id='uploadSubCategoryImage'
                                    className='hidden'
                                    onChange={handleUploadSubCategoryImage}
                                />
                            </label>
                        </div>
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='selectCategory'>Select Category</label>
                        <div className='border focus-within:border-primary-200 rounded'>
                            {/* Display Selected Categories */}
                            <div className='flex flex-wrap gap-2'>
                                {subCategoryData.category.map((cat) => (
                                    <p key={cat._id + "selectedValue"} className='bg-white shadow-md px-1 m-1 flex items-center gap-2'>
                                        {cat.name}
                                        <button
                                            type="button"
                                            className='cursor-pointer hover:text-red-600 bg-transparent border-none p-0 m-0 flex items-center'
                                            onClick={() => handleRemoveCategorySelected(cat._id)}
                                            aria-label="Remove category"
                                        >
                                            <IoClose size={20} />
                                        </button>
                                    </p>
                                ))}
                            </div>

                            {/* Select Category Dropdown */}
                            <select
                                id='selectCategory'
                                className='w-full p-2 bg-transparent outline-none border'
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (!value) return;

                                    const categoryDetails = allCategory.find(el => el._id === value);

                                    // Prevent adding duplicates
                                    if (!subCategoryData.category.find(el => el._id === categoryDetails._id)) {
                                        setSubCategoryData((prev) => ({
                                            ...prev,
                                            category: [...prev.category, categoryDetails]
                                        }));
                                    }
                                }}
                            >
                                <option value=''>Select Category</option>
                                {allCategory.map((category) => (
                                    <option value={category._id} key={category._id + "subcategory"}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        className={`px-4 py-2 border
                            ${subCategoryData.name && subCategoryData.image && subCategoryData.category.length ? "bg-primary-200 hover:bg-primary-100" : "bg-gray-200"}
                            font-semibold
                        `}
                    >
                        Submit
                    </button>

                </form>
            </div>
        </section>
    );
};

UploadSubCategoryModel.propTypes = {
    close: PropTypes.func.isRequired,
    fetchData: PropTypes.func
};

export default UploadSubCategoryModel;
