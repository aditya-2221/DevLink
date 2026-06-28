import { TaskActivity } from "../models/taskActivity.model.js";

export const createTaskActivity = async ({
    task,
    user,
    action,
    metadata= {}
}) => {

    await TaskActivity.create({

        task,

        user,

        action,

        metadata

    });

};