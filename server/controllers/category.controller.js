import CategoryModel from '../models/category.model.js';
import SubCategoryModel from "../models/subcategory.model.js";
import ProductModel from "../models/product.model.js";


export const AddCategoryController = async (req, res) => {
    try{
        const {
            name , image
        } = req.body;
        if(!name || !image){
            return res.status(400).json({
                success: false,
                message: "Name and Image are required"
            });
        }
        const addCategory = new  CategoryModel({
            name,
            image
        })
        const saveCategory = await addCategory.save();
        if(!saveCategory){
            return res.status(400).json({
                success: false,
                message: "Failed to add category",
                error: true
            });
        } 

        return res.status(201).json({
            success: true,
            message: "Category added successfully",
            data: saveCategory,
            error : false
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const getCategoryController = async(req, res) => {
    try{

        const data = await CategoryModel.find().sort({ createdAt : -1})
        return res.json({
            data : data,
            error : false ,
            success : true 
        })

    }catch(error){
        return res.status(500).json({
            message : error.message || error,
            error: true,
            status : false
        })

    }
}

export const updateCategoryController = async(req, res) =>
{
    try{
        const { _id,name, image} = req.body
        const update = await CategoryModel.updateOne({
            _id : _id
        },{
            name,
            image
        })
        return res.json({
            message : "Updated Caregory Successfully",
            error : false,
            success : true,
            data : update

        })

    } catch(error){
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const deleteCategoryController = async (req, res) => {
    try {
        const { _id } = req.body;

        const checkSubCategory = await SubCategoryModel.find({
            category: { "$in": [_id] }
        }).countDocuments();

        const checkProduct = await ProductModel.find({
            category: { "$in": [_id] }
        }).countDocuments();

        if (checkSubCategory > 0 || checkProduct > 0) {
            return res.status(400).json({
                message: "Category is already in use, can't delete",
                error: true,
                success: false
            });
        }

        const deleteCategory = await CategoryModel.deleteOne({ _id: _id });

        return res.json({  // ✅ Fixed here
            message: "Delete category successfully",
            data: deleteCategory,
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
};



