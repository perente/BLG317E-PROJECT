import { API_ROUTE } from "@/lib/routes";
import axiosx from "axios";

const axios = async function () {
    try {
        const res = await axiosx({ ...arguments[0], validateStatus: () => true });
        if (res?.status === 403) {
            removeToken();
        }
        return res;
    } catch (error) {
        console.log(error)
        alert(error)
    }
};

export const getSchedules = async function () {
    return await axios({
        method: "get",
        url: API_ROUTE.schedules,
    });
}
