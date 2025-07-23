import toast from 'react-hot-toast';
const AxiosToastError = (error) => {
     console.log("AXIOS ERROR RESPONSE", error.response); 
    toast.error(error.response?.data?.message || 'Something went wrong');
}
export default AxiosToastError;