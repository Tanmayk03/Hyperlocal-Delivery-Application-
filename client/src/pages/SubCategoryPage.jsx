import React, { useEffect, useState } from 'react';
import UploadSubCategoryModel from '../components/UploadSubCategoryModel';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import DisplayTable from '../components/DisplayTable';
import { createColumnHelper } from '@tanstack/react-table';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { HiPencil } from "react-icons/hi";
import EditSubCategory from '../components/EditSubCategory';
import CofirmBox from '../components/CofirmBox';
import toast from 'react-hot-toast';

const columnHelper = createColumnHelper();

const CategoryCell = ({ category }) => (
    <>
        {category.map((c) => (
            <p key={c._id + 'table'} className='shadow-md px-1 inline-block m-1'>
                {c.name}
            </p>
        ))}
    </>
);

const ImageCell = ({ row, setImageURL }) => {
    return (
        <div
            className="w-20 h-20 border cursor-pointer overflow-hidden"
            onClick={() => setImageURL(row.original.image)}
        >
            <img
                src={row.original.image}
                alt="subCategory"
                className="w-full h-full object-cover"
            />
        </div>
    );
};

const SubCategoryPage = () => {
    const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageURL, setImageURL] = useState('');
    const [openEdit, setOpenEdit] = useState(false);
    const [editData, setEditData] = useState({ _id: '' });
    const [deleteSubCategory, setDeleteSubCategory] = useState({ _id: '' });
    const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

    const fetchSubCategory = async () => {
        try {
            setLoading(true);
            const response = await Axios({ ...SummaryApi.getSubCategory });
            setData(response.data.data || []);
            setLoading(false);
        } catch (error) {
            AxiosToastError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubCategory();
    }, []);

    const columns = [
        columnHelper.accessor('name', {
            header: 'Name',
        }),
        columnHelper.accessor('image', {
            header: 'Image',
            cell: (props) => (
                <ImageCell
                    row={props.row}
                    setImageURL={setImageURL}
                />
            )
        }),
        columnHelper.accessor('category', {
            header: 'Category',
            cell: ({ row }) => (
                <CategoryCell category={row.original.category} />
            )
        }),
        columnHelper.accessor('_id', {
            header: 'Action',
            cell: ({ row }) => (
                <div className='flex items-center justify-center gap-3'>
                    <button
                        onClick={() => {
                            setOpenEdit(true);
                            setEditData(row.original);
                        }}
                        className='p-2 bg-green-100 rounded-full hover:text-green-600'
                    >
                        <HiPencil size={20} />
                    </button>
                    <button
                        onClick={() => {
                            setOpenDeleteConfirmBox(true);
                            setDeleteSubCategory(row.original);
                        }}
                        className='p-2 bg-red-100 rounded-full text-red-500 hover:text-red-600'
                    >
                        <MdDelete size={20} />
                    </button>
                </div>
            )
        })
    ];

    const handleDeleteSubCategory = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteSubCategory,
                data: deleteSubCategory
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                fetchSubCategory();
                setOpenDeleteConfirmBox(false);
                setDeleteSubCategory({ _id: '' });
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className=''>
            <div className='p-2 bg-white shadow-md flex items-center justify-between'>
                <h2 className='font-semibold'>Sub Category</h2>
                <button
                    onClick={() => setOpenAddSubCategory(true)}
                    className='text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded'
                >
                    Add Sub Category
                </button>
            </div>

            <div className='overflow-auto w-full max-w-[95vw]'>
                <DisplayTable
                    data={data}
                    columns={columns}
                />
            </div>

            {openAddSubCategory && (
                <UploadSubCategoryModel
                    close={() => setOpenAddSubCategory(false)}
                    fetchData={fetchSubCategory}
                />
            )}

            {imageURL && (
                <ViewImage url={imageURL} close={() => setImageURL('')} />
            )}

            {openEdit && (
                <EditSubCategory
                    data={editData}
                    close={() => setOpenEdit(false)}
                    fetchData={fetchSubCategory}
                />
            )}

            {openDeleteConfirmBox && (
                <CofirmBox
                    cancel={() => setOpenDeleteConfirmBox(false)}
                    close={() => setOpenDeleteConfirmBox(false)}
                    confirm={handleDeleteSubCategory}
                />
            )}
        </section>
    );
};

export default SubCategoryPage;
