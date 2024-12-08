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
        throw error
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
    try {
        const response = await axios({
            method: "POST",
            url: API_ROUTE.schedules,
            data: data
        });
        return response;
    }
    catch (error) {
        throw error
    }
}

export const deleteSchedule = async function (id) {
    return await axios({
        method: "delete",
        url: `${API_ROUTE.schedules}/${id}`,
    });
}

export const updateSchedule = async function (id, data) {
    try {
        const response = await axios({
            method: "patch",
            url: `${API_ROUTE.schedules}/${id}`,
            data: data
        });
        return response;
    }
    catch (error) {
        throw error
    }
}

export const getMedallists = async function () {
    return await axios({
        method: "get",
        url: API_ROUTE.medallists,
    });
}

export const deleteMedallist = async function (id) {
    return await axios({
        method: "delete",
        url: `${API_ROUTE.medallists}/${id}`,
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
        throw error

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
        throw error
    }
}

export const getEvents = async function (filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    try {
        const response = await axios({
            method: "GET",
            url: `${API_ROUTE.events}?${queryParams}`,
        });
        return response;
    }
    catch (error) {
        throw error;
    }
}

export const createNewEvent = async function (data) {
    try {
        const response = await axios({
            method: "POST",
            url: API_ROUTE.events,
            data: data,
        });
        return response;
    }
    catch (error) {
        throw error;
    }
}

export const deleteEvent = async function (id) {
    return await axios({
        method: "DELETE",
        url: `${API_ROUTE.events}/${id}`,
    });
}

export const updateEvent = async function (id, data) {
    try {
        const response = await axios({
            method: "PATCH",
            url: `${API_ROUTE.events}/${id}`,
            data: data,
        });
        return response;
    }
    catch (error) {
        throw error;
    }
}

export const getCountries = async function (filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    try {
        const response = await axios({
            method: "GET",
            url: `${API_ROUTE.countries}?${queryParams}`,
        });
        return response;
    }
    catch (error) {
        throw error;
    }
}

export const createNewCountry = async function (data) {
    try {
        const response = await axios({
            method: "POST",
            url: API_ROUTE.countries,
            data: data,
        });
        return response;
    }
    catch (error) {
        throw error;
    }
}

export const deleteCountry = async function (country_code) {
    return await axios({
        method: "DELETE",
        url: `${API_ROUTE.countries}/${country_code}`,
    });
}

export const updateCountry = async function (country_code, data) {
    try {
        const response = await axios({
            method: "PATCH",
            url: `${API_ROUTE.countries}/${id}`,
            data: data,
        });
        return response;
    }
    catch (error) {
        throw error;
    }
}

export const getAthletes = async function (filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return await axios({
        method: "get",
        url: `${API_ROUTE.athletes}?${queryParams}`,
    });
};