import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

const uploadImageController = async (req, res) => {
    try {
        console.log("Request Files:", req.files);

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const file = req.files[0]; // ✅ Get the first uploaded file

        // ✅ File type validation (webp added)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Only JPEG, PNG, JPG, and WEBP images are allowed"
            });
        }

        // ✅ File size validation (example: max 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (file.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: "File size exceeds 2MB limit"
            });
        }

        const uploadImage = await uploadImageCloudinary(file);

        return res.json({
            message: "Upload Done",
            data: uploadImage,
            success: true,
            error: false
        });
    } catch (error) {
        console.error("Upload Image Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export default uploadImageController;
