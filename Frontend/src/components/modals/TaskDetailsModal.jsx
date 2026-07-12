import {
    X,
    CalendarDays,
    Flag,
    User,
    Pencil,
    History,
    UserPlus,
    RefreshCw,
    PlusCircle,
    Paperclip,
    Download,
    Upload,
    File,
    Image,
    FileText,
    Trash2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { updateTask } from "../../services/taskService";
import { assignTask, moveTask, uploadAttachments, deleteAttachment } from "../../services/taskService";
import { useState, useEffect } from "react";

import { getTaskActivities } from "../../services/taskActivityService";

import DeleteTaskModal from "./DeleteTaskModal";

import { deleteTask } from "../../services/taskService";

import toast from "react-hot-toast";

function TaskDetailsModal({

    open,

    task,

    members,

    onClose,

    refreshTasks,

    setSelectedTask


}) {

    if (!open || !task) return null;
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [deleting, setDeleting] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [assigneeLoading, setAssigneeLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(task?.status || "TODO");

    const [selectedAssignee, setSelectedAssignee] = useState(task?.assignedTo?._id || "");

    const [isEditing, setIsEditing] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [activities, setActivities] = useState([]);
    const [activityLoading, setActivityLoading] = useState(false);

    const [uploading, setUploading] = useState(false);
    const [deletingAttachment, setDeletingAttachment] = useState("");
    const [attachments, setAttachments] = useState(task.attachments || []);


    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "",
        dueDate: ""
    });



    const handleDelete = async () => {

        try {

            setDeleting(true);

            await deleteTask(task._id);

            toast.success("Task deleted successfully");

            setShowDeleteModal(false);

            onClose();

            refreshTasks();
            await fetchActivities();

        }

        catch (error) {

            toast.error(

                error?.response?.data?.message ||

                "Failed to delete task"

            );

        }

        finally {

            setDeleting(false);

        }

    };

    const handleUpdateTask = async () => {

        try {

            setUpdating(true);

            const response = await updateTask(task._id, formData);
            toast.success("Task updated");


            setSelectedTask(response.data.data);

            await refreshTasks();
            await fetchActivities();

            setIsEditing(false);

        }

        catch (err) {

            toast.error(

                err?.response?.data?.message ||

                "Failed to update task"

            );

        }

        finally {

            setUpdating(false);

        }

    };
    const handleStatusChange = async (status) => {

        if (status === selectedStatus) return;

        setSelectedStatus(status);

        try {

            setStatusLoading(true);

            await moveTask(task._id, status);

            toast.success("Status updated");

            await refreshTasks();
            await fetchActivities();

        } catch (err) {

            setSelectedStatus(task.status);

            toast.error(
                err?.response?.data?.message ||
                "Failed to update status"
            );

        } finally {

            setStatusLoading(false);

        }

    };
    const handleUploadAttachments = async (e) => {

        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        try {

            setUploading(true);

            const formData = new FormData();

            files.forEach(file => {
                formData.append("attachments", file);
            });

            const res = await uploadAttachments(
                task._id,
                formData
            );

            setSelectedTask(res.data.data);

            await refreshTasks();

            await fetchActivities();

            toast.success("Attachments uploaded successfully");

        } catch (err) {

            toast.error(
                err?.response?.data?.message ||
                "Failed to upload attachments"
            );

        } finally {

            setUploading(false);

            e.target.value = "";

        }

    };
    const handleDeleteAttachment = async (attachmentId) => {

        try {

            setDeletingAttachment(attachmentId);

            const res = await deleteAttachment(
                task._id,
                attachmentId
            );

            setSelectedTask(res.data.data);

            await refreshTasks();

            await fetchActivities();

            toast.success("Attachment deleted");

        } catch (err) {

            toast.error(
                err?.response?.data?.message ||
                "Failed to delete attachment"
            );

        } finally {

            setDeletingAttachment("");

        }

    };
    const formatFileSize = (bytes) => {

        if (!bytes) return "0 B";

        const sizes = [
            "B",
            "KB",
            "MB",
            "GB"
        ];

        const i = Math.floor(
            Math.log(bytes) / Math.log(1024)
        );

        return (
            (bytes / Math.pow(1024, i)).toFixed(1) +
            " " +
            sizes[i]
        );

    };
    const getFileIcon = (type) => {

        if (!type)
            return (
                <File
                    size={18}
                    className="text-slate-400"
                />
            );

        if (type.startsWith("image")) {
            return (
                <Image
                    size={18}
                    className="text-green-400"
                />
            );
        }

        if (type.includes("pdf")) {
            return (
                <FileText
                    size={18}
                    className="text-red-400"
                />
            );
        }

        return (
            <File
                size={18}
                className="text-cyan-400"
            />
        );

    };

    const handleAssign = async (userId) => {

        if (userId === selectedAssignee) return;

        setSelectedAssignee(userId);

        try {

            setAssigneeLoading(true);

            await assignTask(task._id, userId);

            toast.success("Task reassigned");

            await refreshTasks();

        }

        catch (err) {

            setSelectedAssignee(task.assignedTo?._id || "");

            toast.error(
                err?.response?.data?.message ||
                "Failed to assign task"
            );

        }

        finally {

            setAssigneeLoading(false);

        }

    }

    const fetchActivities = async () => {

        try {

            setActivityLoading(true);

            const res = await getTaskActivities(task._id);

            setActivities(res.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setActivityLoading(false);

        }

    };

    useEffect(() => {

        if (!task) return;

        setSelectedStatus(task.status);

        setSelectedAssignee(task.assignedTo?._id || "");

    }, [task]);

    useEffect(() => {

        if (!task) return;

        setFormData({
            title: task.title,
            description: task.description || "",
            priority: task.priority,
            dueDate: task.dueDate
                ? task.dueDate.slice(0, 10)
                : ""
        });

    }, [task]);

    useEffect(() => {

        if (!task) return;

        fetchActivities();

    }, [task]);

    const priorityColors = {

        HIGH:
            "bg-red-500/15 text-red-400 border-red-500/20",

        MEDIUM:
            "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",

        LOW:
            "bg-green-500/15 text-green-400 border-green-500/20"

    };

    const statusColors = {

        TODO:
            "text-blue-400",

        IN_PROGRESS:
            "text-yellow-400",

        DONE:
            "text-green-400"

    };
    const getActivityUI = (activity) => {

        switch (activity.action) {

            case "TASK_CREATED":

                return {

                    icon: (
                        <PlusCircle
                            size={16}
                            className="text-emerald-400"
                        />
                    ),

                    title: "Created Task",

                    subtitle: (
                        <span className="text-slate-300">
                            Created
                            <span className="font-semibold text-cyan-300">
                                {" "}{activity.metadata.title}
                            </span>
                        </span>
                    )

                };

            case "TITLE_UPDATED":

                return {

                    icon: (
                        <Pencil
                            size={16}
                            className="text-purple-400"
                        />
                    ),

                    title: "Changed Title",

                    subtitle: (
                        <div className="flex items-center gap-2 flex-wrap">

                            <span className="
                            px-2 py-1

                            rounded-lg

                            bg-slate-800

                            text-slate-300
                        ">
                                {activity.metadata.from}
                            </span>

                            <span className="text-slate-500">
                                →
                            </span>

                            <span className="
                            px-2 py-1

                            rounded-lg

                            bg-cyan-500/15

                            text-cyan-300
                        ">
                                {activity.metadata.to}
                            </span>

                        </div>
                    )

                };

            case "DESCRIPTION_UPDATED":

                return {

                    icon: (
                        <Pencil
                            size={16}
                            className="text-purple-400"
                        />
                    ),

                    title: "Updated Description",

                    subtitle: (
                        <span className="text-slate-300">
                            Task description was updated.
                        </span>
                    )

                };

            case "PRIORITY_UPDATED":

                return {

                    icon: (
                        <Flag
                            size={16}
                            className="text-yellow-400"
                        />
                    ),

                    title: "Changed Priority",

                    subtitle: (
                        <div className="flex items-center gap-2">

                            <span className="
                            px-2 py-1

                            rounded-lg

                            bg-orange-500/15

                            text-orange-300
                        ">
                                {activity.metadata.from}
                            </span>

                            <span className="text-slate-500">
                                →
                            </span>

                            <span className="
                            px-2 py-1

                            rounded-lg

                            bg-yellow-500/15

                            text-yellow-300
                        ">
                                {activity.metadata.to}
                            </span>

                        </div>
                    )

                };

            case "DUE_DATE_UPDATED":

                return {

                    icon: (
                        <CalendarDays
                            size={16}
                            className="text-cyan-400"
                        />
                    ),

                    title: "Changed Due Date",

                    subtitle: (
                        <div className="flex items-center gap-2 flex-wrap">

                            <span className="
                            px-2 py-1

                            rounded-lg

                            bg-slate-800

                            text-slate-300
                        ">
                                {new Date(activity.metadata.from).toLocaleDateString()}
                            </span>

                            <span className="text-slate-500">
                                →
                            </span>

                            <span className="
                            px-2 py-1

                            rounded-lg

                            bg-cyan-500/15

                            text-cyan-300
                        ">
                                {new Date(activity.metadata.to).toLocaleDateString()}
                            </span>

                        </div>
                    )

                };

            case "STATUS_CHANGED":

                return {

                    icon: (
                        <RefreshCw
                            size={16}
                            className="text-blue-400"
                        />
                    ),

                    title: "Changed Status",

                    subtitle: (
                        <div className="flex items-center gap-2">

                            <span className="
                            px-2 py-1

                            rounded-lg

                            bg-slate-800

                            text-slate-300
                        ">
                                {activity.metadata.from}
                            </span>

                            <span className="text-slate-500">
                                →
                            </span>

                            <span className="
                            px-2 py-1

                            rounded-lg

                            bg-blue-500/15

                            text-cyan-300
                        ">
                                {activity.metadata.to}
                            </span>

                        </div>
                    )

                };

            case "TASK_ASSIGNED":

                return {

                    icon: (
                        <UserPlus
                            size={16}
                            className="text-green-400"
                        />
                    ),

                    title: "Assigned Task",

                    subtitle: (
                        <div className="flex items-center gap-2 flex-wrap">

                            <span className="
                            px-2 py-1

                            rounded-lg

                            bg-slate-800

                            text-slate-300
                        ">
                                {activity.metadata.from || "Unassigned"}
                            </span>

                            <span className="text-slate-500">
                                →
                            </span>

                            <span className="
                            px-2 py-1

                            rounded-lg

                            bg-green-500/15

                            text-green-300
                        ">
                                {activity.metadata.to}
                            </span>

                        </div>
                    )

                };

            case "ATTACHMENT_UPLOADED":

                return {

                    icon: (
                        <div
                            className="
                h-8
                w-8

                rounded-xl

                bg-cyan-500/15

                flex
                items-center
                justify-center
                "
                        >
                            <Paperclip
                                size={16}
                                className="text-cyan-400"
                            />
                        </div>
                    ),

                    title: "Attachment Uploaded",

                    subtitle: (

                        <div className="space-y-1">

                            <p className="text-slate-300">

                                Uploaded

                                <span className="font-semibold text-cyan-300">

                                    {" "}
                                    {activity.metadata.fileName}

                                </span>

                            </p>

                        </div>

                    )

                };



            case "ATTACHMENT_REMOVED":

                return {

                    icon: (
                        <div
                            className="
                h-8
                w-8

                rounded-xl

                bg-red-500/15

                flex
                items-center
                justify-center
                "
                        >
                            <Trash2
                                size={16}
                                className="text-red-400"
                            />
                        </div>
                    ),

                    title: "Attachment Removed",

                    subtitle: (

                        <div className="space-y-1">

                            <p className="text-slate-300">

                                Removed

                                <span className="font-semibold text-red-300">

                                    {" "}
                                    {activity.metadata.fileName}

                                </span>

                            </p>

                        </div>

                    )

                };

            default:

                return {

                    icon: (
                        <History
                            size={16}
                            className="text-slate-400"
                        />
                    ),

                    title: activity.action,

                    subtitle: null

                };

        }

    };

    return (

        <>

            {/* Overlay */}

            <div

                onClick={onClose}

                className="
                fixed
                inset-0

                bg-black/60

                backdrop-blur-sm
                h-full
                z-40
            "

            />

            {/* Drawer */}

            <div

                className="
                fixed

                top-0
                right-0

                h-screen

                w-[480px]

                bg-[#111827]

                border-l
                border-white/10

                z-50

                overflow-y-auto

                shadow-2xl

                p-8
            "

            >

                {/* Header */}

                <div className="flex items-start justify-between">

                    <div>

                        {
                            isEditing ? (

                                <input

                                    type="text"

                                    value={formData.title}

                                    onChange={(e) =>

                                        setFormData(prev => ({

                                            ...prev,

                                            title: e.target.value

                                        }))

                                    }

                                    className="
                w-full

                rounded-xl

                bg-slate-900

                border
                border-blue-500/10

                px-4
                py-3

                text-2xl
                font-bold
                text-white

                outline-none

                focus:border-cyan-400
            "

                                />

                            ) : (

                                <h2
                                    className="
                text-2xl
                font-bold
                text-white
            "
                                >
                                    {task.title}
                                </h2>

                            )
                        }

                        <p
                            className="
                mt-2
                text-sm
                text-slate-400
            "
                        >
                            Task Details
                        </p>

                    </div>

                    <div className="flex items-center gap-2">

                        <button
                            onClick={() => { setIsEditing(true) }}
                            className="
                p-2.5

                rounded-xl

                text-slate-400

                hover:bg-blue-500/10
                hover:text-cyan-300

                transition
            "
                        >
                            <Pencil size={18} />
                        </button>

                        <button

                            onClick={() => setShowDeleteModal(true)}

                            className="
        p-2.5

        rounded-xl

        text-slate-400

        hover:bg-red-500/10

        hover:text-red-400

        transition
    "

                        >

                            <Trash2 size={18} />

                        </button>

                        <button
                            onClick={onClose}
                            className="
                p-2.5

                rounded-xl

                text-slate-400

                hover:bg-slate-800
                hover:text-white

                transition
            "
                        >
                            <X size={18} />
                        </button>

                    </div>

                </div>

                {/* Priority */}

                <div className="mt-8">

                    <p className="text-slate-500">

                        Priority

                    </p>

                    {

                        isEditing ?

                            (

                                <select

                                    value={formData.priority}

                                    onChange={(e) =>

                                        setFormData(prev => ({

                                            ...prev,

                                            priority: e.target.value

                                        }))

                                    }

                                    className="
                    mt-3

                    w-full

                    rounded-xl

                    border
                    border-blue-500/10

                    bg-slate-900

                    px-4
                    py-3

                    text-white

                    outline-none

                    focus:border-cyan-400
                "

                                >

                                    <option value="HIGH">
                                        High
                                    </option>

                                    <option value="MEDIUM">
                                        Medium
                                    </option>

                                    <option value="LOW">
                                        Low
                                    </option>

                                </select>

                            )

                            :

                            (

                                <span

                                    className={`
                    inline-flex

                    mt-2

                    px-4
                    py-2

                    rounded-full

                    border

                    ${priorityColors[task.priority]}
                `}

                                >

                                    <Flag
                                        size={15}
                                        className="mr-2"
                                    />

                                    {task.priority}

                                </span>

                            )

                    }

                </div>

                {/* Status */}

                <div className="mt-8">

                    <p className="text-slate-500">

                        Status

                    </p>

                    <select
                        disabled={statusLoading}
                        value={selectedStatus}

                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="
        mt-3

        w-full

        rounded-xl

        border
        border-blue-500/10

        bg-slate-900

        px-4
        py-3

        text-white

        outline-none

        focus:border-cyan-400
    "
                    >

                        <option value="TODO">To Do</option>

                        <option value="IN_PROGRESS">
                            In Progress
                        </option>

                        <option value="DONE">
                            Done
                        </option>

                    </select>

                </div>

                {/* Assignee */}

                <div className="mt-8">

                    <p className="text-slate-500 mb-3">

                        Assigned To

                    </p>

                    <select

                        disabled={assigneeLoading}

                        value={selectedAssignee}


                        onChange={(e) => handleAssign(e.target.value)}

                        className="
            w-full

            rounded-xl

            border
            border-blue-500/10

            bg-slate-900

            px-4
            py-3

            text-white

            outline-none

            focus:border-cyan-400
        "

                    >


                        {members.map(member => (

                            <option

                                key={member.user._id}

                                value={member.user._id}

                            >

                                {member.user.fullName}

                            </option>

                        ))}

                    </select>

                </div>

                {/* Due Date */}

                <div className="mt-8">

                    <p className="text-slate-500">

                        Due Date

                    </p>

                    {

                        isEditing ?

                            (

                                <input

                                    type="date"

                                    value={formData.dueDate}

                                    onChange={(e) =>

                                        setFormData(prev => ({

                                            ...prev,

                                            dueDate: e.target.value

                                        }))

                                    }

                                    className="
                    mt-3

                    w-full

                    rounded-xl

                    border
                    border-blue-500/10

                    bg-slate-900

                    px-4
                    py-3

                    text-white

                    outline-none

                    focus:border-cyan-400
                "

                                />

                            )

                            :

                            (

                                <div

                                    className="
                    mt-3

                    flex
                    items-center
                    gap-2

                    text-white
                "

                                >

                                    <CalendarDays size={18} />

                                    {

                                        task.dueDate ?

                                            new Date(task.dueDate)

                                                .toLocaleDateString()

                                            :

                                            "Not set"

                                    }

                                </div>

                            )

                    }

                </div>

                {/* Description */}

                <div className="mt-8">

                    <p className="text-slate-500">

                        Description

                    </p>

                    {

                        isEditing ?

                            (

                                <textarea

                                    rows={6}

                                    value={formData.description}

                                    onChange={(e) =>

                                        setFormData(prev => ({

                                            ...prev,

                                            description: e.target.value

                                        }))

                                    }

                                    className="
                    mt-3

                    w-full

                    rounded-xl

                    border
                    border-blue-500/10

                    bg-slate-900

                    px-4
                    py-3

                    text-slate-300

                    outline-none

                    resize-none

                    focus:border-cyan-400
                "

                                />

                            )

                            :

                            (

                                <p

                                    className="
                    mt-3

                    leading-7

                    text-slate-300
                "

                                >

                                    {

                                        task.description ||

                                        "No description."

                                    }

                                </p>

                            )

                    }

                </div>


                {/* Attachments */}

                <div className="mt-10">

                    <div className="flex items-center justify-between">

                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">

                            <Paperclip size={18} />

                            Attachments

                            {task.attachments?.length > 0 && (

                                <span
                                    className="
                        ml-2

                        rounded-full

                        bg-cyan-500/15

                        px-2
                        py-1

                        text-xs

                        text-cyan-300
                    "
                                >
                                    {task.attachments.length}
                                </span>

                            )}

                        </h3>

                        <label
                            className={`
                cursor-pointer

                rounded-xl

                px-4
                py-2

                text-sm

                font-medium

                transition

                ${uploading
                                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                                    : "bg-cyan-600 hover:bg-cyan-500 text-white"
                                }
            `}
                        >

                            <Upload size={16} className="inline mr-2" />

                            {uploading ? "Uploading..." : "Upload"}

                            <input
                                type="file"
                                hidden
                                multiple
                                disabled={uploading}
                                onChange={handleUploadAttachments}
                            />

                        </label>

                    </div>

                    <div className="mt-5 space-y-3">

                        {task.attachments?.length === 0 ? (

                            <div
                                className="
                    rounded-2xl

                    border
                    border-dashed
                    border-slate-700

                    p-8

                    text-center

                    text-slate-500
                "
                            >

                                <Paperclip
                                    size={26}
                                    className="mx-auto mb-3 opacity-60"
                                />

                                    No attachments yet <br />

                                <span>Upload design files, documents,or images related to this task.</span>

                            </div>

                        ) : (

                            task.attachments?.map((attachment) => (

                                <div
                                    key={attachment._id}
                                    className="
                        flex

                        items-center

                        justify-between

                        rounded-2xl

                        border
                        border-white/5

                        bg-slate-900/50

                        p-4

                        hover:border-cyan-500/20
                        hover:shadow-lg
hover:scale-[1.01]
transition-all
duration-200
                        transition
                    "
                                >

                                    <div className="flex items-center gap-4">

                                        <div
                                            className="
                                h-11
                                w-11

                                rounded-xl

                                bg-cyan-500/10

                                flex
                                items-center
                                justify-center
                            "
                                        >

                                            {getFileIcon(attachment.fileType)}

                                        </div>

                                        <div>

                                            <h4 className="font-medium text-white">

                                                {attachment.fileName}

                                            </h4>

                                            <p className="mt-1 text-xs text-slate-500">

                                                {formatFileSize(attachment.size)}

                                                {" • "}

                                                {attachment.uploadedBy?.fullName}

                                            </p>

                                            <p className="text-xs text-slate-600">

                                                {formatDistanceToNow(
                                                    new Date(attachment.uploadedAt),
                                                    {
                                                        addSuffix: true
                                                    }
                                                )}

                                            </p>

                                        </div>

                                    </div>

                                    <div className="flex items-center gap-2">

                                        <a
                                            href={attachment.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="
                                rounded-lg

                                p-2

                                text-cyan-400

                                hover:bg-cyan-500/10

                                transition
                            "
                                        >

                                            <Download size={18} />

                                        </a>

                                        <button

                                            onClick={() =>
                                                handleDeleteAttachment(
                                                    attachment._id
                                                )
                                            }

                                            disabled={
                                                deletingAttachment === attachment._id
                                            }

                                            className="
                                rounded-lg

                                p-2

                                text-red-400

                                hover:bg-red-500/10

                                transition

                                disabled:opacity-50
                            "
                                        >

                                            <Trash2 size={18} />

                                        </button>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>
                <div className="mt-10">

                    <h3
                        className="
            text-lg
            font-semibold
            text-white
        "
                    >

                        Activity

                    </h3>

                    <div className="mt-5 space-y-5">

                        {

                            activityLoading ?

                                (

                                    <p className="text-slate-500">

                                        Loading...

                                    </p>

                                )

                                :

                                activities.length === 0 ?

                                    (

                                        <p className="text-slate-500">

                                            No activity yet.

                                        </p>

                                    )

                                    :

                                    (

                                        activities.map(activity => {

                                            const ui = getActivityUI(activity);

                                            return (

                                                <div

                                                    key={activity._id}

                                                    className="
                relative

                flex
                gap-4

                rounded-2xl

                border
                border-white/5

                bg-slate-900/40

                p-4

                hover:border-cyan-400/20

                transition
            "

                                                >

                                                    <img

                                                        src={activity.user.avatar}

                                                        className="
                    h-11
                    w-11

                    rounded-full

                    object-cover
                "

                                                    />

                                                    <div className="flex-1">

                                                        <div className="flex items-center gap-2">

                                                            {ui.icon}

                                                            <h4
                                                                className="
                            text-white

                            font-medium
                        "
                                                            >

                                                                {ui.title}

                                                            </h4>

                                                        </div>

                                                        <div
                                                            className="
        mt-2

        flex
        flex-wrap
        items-center
        gap-2

        text-sm
        text-slate-400
    "
                                                        >

                                                            <span className="font-medium text-cyan-300">

                                                                {activity.user.fullName}

                                                            </span>

                                                            <span className="text-slate-500">

                                                                •

                                                            </span>

                                                            {ui.subtitle}

                                                        </div>

                                                        <p
                                                            className="
                        mt-2

                        text-xs

                        text-slate-500
                    "
                                                        >

                                                            {

                                                                formatDistanceToNow(

                                                                    new Date(activity.createdAt),

                                                                    {

                                                                        addSuffix: true

                                                                    }

                                                                )

                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                            );

                                        })

                                    )

                        }

                    </div>

                </div>
                {
                    isEditing && (

                        <div

                            className="
                mt-10

                flex
                justify-end
                gap-4
            "

                        >

                            <button

                                onClick={() => setIsEditing(false)}

                                className="
                    px-5
                    py-3

                    rounded-xl

                    border
                    border-slate-700

                    text-white

                    hover:bg-slate-800
                "

                            >

                                Cancel

                            </button>

                            <button

                                onClick={handleUpdateTask}

                                className="
                    px-6
                    py-3

                    rounded-xl

                    bg-blue-600

                    hover:bg-blue-500

                    text-white
                "

                            >

                                Save Changes

                            </button>

                        </div>

                    )
                }


            </div>


            <DeleteTaskModal

                open={showDeleteModal}

                loading={deleting}

                task={task}

                onClose={() => setShowDeleteModal(false)}

                onDelete={handleDelete}

            />


        </>

    );

}

export default TaskDetailsModal;