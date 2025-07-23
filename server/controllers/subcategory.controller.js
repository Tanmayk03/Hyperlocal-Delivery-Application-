import SubCategoryModel from "../models/subcategory.model.js";

export const AddSubCategoryController = async (req, res) => {
    try {
        const {name , image , category } = req.body
        if (!name || !image || !category[0]) {
            return res.status(400).json({ success: false, message: "All fields are required", error : true });
        }
        const payload = {
            name,
            image,
            category: category[0],
        }
        const createSubCategory = new SubCategoryModel(payload);
        await createSubCategory.save();
        res.status(201).json({ success: true, data: createSubCategory });
        return res.status(201).json({ success: true, message: "Subcategory created successfully", data: createSubCategory , error : false });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || error , error : true });
    }
};
export const getSubCategoryController = async(request,response)=>{
    try {
        const data = await SubCategoryModel.find().sort({createdAt : -1}).populate('category')
        return response.json({
            message : "Sub Category data",
            data : data,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
};
export const updateSubCategoryController = async(request,response)=>{
    try {
        const { _id, name, image,category } = request.body 

        const checkSub = await SubCategoryModel.findById(_id)

        if(!checkSub){
            return response.status(400).json({
                message : "Check your _id",
                error : true,
                success : false
            })
        }

        const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id,{
            name,
            image,
            category
        })

        return response.json({
            message : 'Updated Successfully',
            data : updateSubCategory,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false 
        })
    }
};
export const deleteSubCategoryController = async(request,response)=>{
    try {
        const { _id } = request.body 
        console.log("Id",_id)
        const deleteSub = await SubCategoryModel.findByIdAndDelete(_id)

        return response.json({
            message : "Delete successfully",
            data : deleteSub,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
