import Axios from "./Axios";
import SummaryApi from "../common/SummaryApi";

const fetchUserDetails = async () => {
  try {
    const response = await Axios(SummaryApi.userDetails);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ User fetch failed:", error.response.data);
    } else if (error.request) {
      console.error("❌ No response from server:", error.request);
    } else {
      console.error("❌ Axios config error:", error.message);
    }
    return null;
  }
};

export default fetchUserDetails;
