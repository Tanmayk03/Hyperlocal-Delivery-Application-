import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImageCloudinary = (file) => {
    console.log('Uploading file to Cloudinary:', file);
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { 
                folder: 'category-images',
                resource_type: 'image', // ✅ Always specify
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] // ✅ Added webp support
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
        
    });
};

export default uploadImageCloudinary;
