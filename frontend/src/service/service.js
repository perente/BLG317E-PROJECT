import { API_ROUTE } from "@/lib/routes";
import axiosx from "axios";

const axios = async function () {
    try {
        const res = await axiosx({ ...arguments[0], validateStatus: () => true });
        if (res?.status >= 399 && res?.status < 500) {
            throw res?.data?.error;
        } else if (res?.status >= 500) {
            throw res?.data?.error;
        }
        return res;
    } catch (error) {
        console.log(error)
        alert(error)
    }
};


export const getSchedules = async function (filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return await axios({
        method: "get",
        url: `${API_ROUTE.schedules}?${queryParams}`,
    });
};

export const createNewSchedule = async function (data) {
    return await axios({
        method: "post",
        url: API_ROUTE.schedules,
        data: data,
    });
}
export const deleteSchedule = async function (id) {
    return await axios({
        method: "delete",
        url: `${API_ROUTE.schedules}/${id}`,
    });
}

export const getDisciplines = async function () {
    return await axios({
        method: "get",
        url: API_ROUTE.disciplines,
    });
}

export const deleteDiscipline = async function (id) {
    return await axios({
        method: "delete",
        url: `${API_ROUTE.disciplines}/${id}`,
    });
}

export const newDiscipline = async function ({ discipline_code, name }) {
    try {
        const response = await axios({
            method: "post",
            url: API_ROUTE.disciplines,
            data: {
                discipline_code,
                name
            }
        });
        return response;
    }
    catch (error) {
        console.log(error)
        alert(error)
    }
}

export const updateDiscipline = async function ({ discipline_code, name, id }) {
    try {
        const response = await axios({
            method: "patch",
            url: `${API_ROUTE.disciplines}/${id}`,
            data: {
                discipline_code,
                name
            }
        });
        return response;
    }
    catch (error) {
        console.log(error)
        alert(error)
    }
}
