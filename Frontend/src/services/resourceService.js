import api from "../api/axios";


export const uploadResources = (

    teamId,

    formData,

    onUploadProgress

) =>

    api.post(

        `/resources/team/${teamId}`,

        formData,

        {

            onUploadProgress

        }

    );



export const getResources = (
    teamId,
    params = {}
) =>
    api.get(
        `/resources/team/${teamId}`,
        {
            params
        }
    );



export const deleteResource = (
    resourceId
) =>
    api.delete(
        `/resources/${resourceId}`
    );



export const incrementDownload = (
    resourceId
) =>
    api.patch(
        `/resources/${resourceId}/download`
    );