import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

const uploadImage = async (image) => {
    try {
        const formData = new FormData();
        formData.append('file', image);

        const response = await Axios.post(SummaryApi.uploadImage.url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return response;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};

export default uploadImage;
