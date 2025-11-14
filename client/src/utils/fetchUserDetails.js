import Axios from "./Axios";
import SummaryApi from "../common/SummaryApi";

const fetchUserDetails = async () => {
  try {
    const response = await Axios(SummaryApi.userDetails);
    return response.data;
  } catch (error) {
    // Silently handle 401 errors (user not logged in - this is expected)
    if (error.response?.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    }
    // Only log unexpected errors (not connection errors)
    if (error.code !== 'ERR_NETWORK') {
      if (error.response) {
        console.error("❌ User fetch failed:", error.response.data);
      } else if (error.request) {
        console.error("❌ No response from server");
      } else {
        console.error("❌ Axios config error:", error.message);
      }
    }
    return null;
  }
};

export default fetchUserDetails;
