import axios from "axios";
import SummaryApi, {baseURL} from "../common/SummaryApi";
const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true,
})
Axios.interceptors.request.use(
    async(config)=>{
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error)=> {
        return Promise.reject(error);
    }
)
Axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async(error) => {
       let originalRequest = error.config;
       // Check if error.response exists before accessing its properties
       if( error.response && error.response.status === 401 && !originalRequest.retry) {
            originalRequest.retry = true;
           const refreshToken = localStorage.getItem('refreshToken');
           if(refreshToken){
            const newAccessToken = await refreshAccessToken(refreshToken);
            if(newAccessToken){
                originalRequest.headers.Authorization= `Bearer ${newAccessToken}`;
                return Axios(originalRequest);
            } else {
                // Refresh failed, clear tokens
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
           }
        }
        return Promise.reject(error);
    }
);
const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await Axios({
            ...SummaryApi.refreshToken,
            headers : {
                Authorization: `Bearer ${refreshToken}`
            }
        })
        const accessToken = response.data.data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        return accessToken;
    }catch (error) {
        // If refresh token is invalid (403) or expired, clear tokens
        if (error.response?.status === 403 || error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
        // Don't log expected authentication errors
        return null;
    }
}
export default Axios;