import { API_ROUTE } from "@/lib/routes";
import axios from "axios";

console.log("API_ROUTE.teams:", API_ROUTE.teams);

const customAxios = async function (config) {
    try {

        const res = await axios({
            ...config, 
            validateStatus: () => true, 
        });


        if (res?.status >= 400 && res?.status < 500) {
            throw new Error(res?.data?.error || "Client Error");
        } else if (res?.status >= 500) {
            throw new Error(res?.data?.error || "Server Error");
        }

        return res;
    } catch (error) {
        console.error("Axios Error:", error);
        alert(error.message || "An error occurred"); 
        throw error; 
    }
};

export default customAxios;

export const getTeams = async () => {
    try {
      const response = await axios.get(`${API_ROUTE.teams}`);
      console.log("API Response Data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching teams:", error);
      throw error; 
    }
  };

// Delete a Team
export const deleteTeam = async (teamCode) => {
    try {
        const response = await customAxios({
            method: "DELETE",
            url: `${API_ROUTE.teams}/${teamCode}`, 
        });
        return response.data; 
    } catch (error) {
        console.error("Error deleting team:", error);
        throw error;
    }
};
