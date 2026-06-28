import api from "../api/axios";

export const getTaskActivities = async (taskId) => {

    const response = await api.get(
        `/tasks/${taskId}/activity`
    );

    return response.data;

};