import {
    Heart,
    MessageCircle,
    UserPlus,
    CheckCircle2,
    XCircle,
    FolderOpen,
    Bell,
    Paperclip,
    ClipboardList,
    Trash2,
    Users,
    Check,
    Clock
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
    acceptTeamInvitation,
    rejectTeamInvitation
} from "../../services/notificationService";

import {
    fetchNotifications
} from "../../features/notifications/notificationSlice";

function NotificationCard({

    notification,

    onRead,

    onDelete

}) {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const getConfig = () => {

        switch (notification.type) {

            case "PROJECT_LIKED":

                return {

                    icon: (
                        <Heart
                            size={18}
                            className="text-pink-400"
                        />
                    ),

                    color:
                        "bg-pink-500/10 border-pink-500/20"

                };

            case "PROJECT_COMMENTED":

                return {

                    icon: (
                        <MessageCircle
                            size={18}
                            className="text-cyan-400"
                        />
                    ),

                    color:
                        "bg-pink-500/10 border-pink-500/20"

                };

            case "APPLICATION_RECEIVED":
            case "APPLICATION_ACCEPTED":
            case "APPLICATION_REJECTED":

                return {

                    icon: (
                        <UserPlus
                            size={18}
                            className="text-green-400"
                        />
                    ),

                    color:
                        "bg-green-500/10 border-green-500/20"

                };

            case "TEAM_INVITE":

                return {

                    icon: (
                        <Users
                            size={18}
                            className="text-blue-400"
                        />
                    ),

                    color:
                        "bg-blue-500/10 border-blue-500/20"

                };

            case "TEAM_INVITE_ACCEPTED":

                return {

                    icon: (
                        <CheckCircle2
                            size={18}
                            className="text-green-400"
                        />
                    ),

                    color:
                        "bg-green-500/10 border-green-500/20"

                };

            case "TEAM_INVITE_REJECTED":

                return {

                    icon: (
                        <XCircle
                            size={18}
                            className="text-red-400"
                        />
                    ),

                    color:
                        "bg-red-500/10 border-red-500/20"

                };

            case "TEAM_JOINED":
            case "TEAM_REMOVED":

                return {

                    icon: (
                        <Users
                            size={18}
                            className="text-violet-400"
                        />
                    ),

                    color:
                        "bg-blue-500/10 border-blue-500/20"

                };

            case "TEAM_RESOURCE":

                return {

                    icon: (
                        <FolderOpen
                            size={18}
                            className="text-cyan-400"
                        />
                    ),

                    color:
                        "bg-blue-500/10 border-blue-500/20"

                };

            case "TEAM_ANNOUNCEMENT":

                return {

                    icon: (
                        <Bell
                            size={18}
                            className="text-yellow-400"
                        />
                    ),

                    color:
                        "bg-blue-500/10 border-blue-500/20"
                };

            case "TASK_ASSIGNED":

                return {

                    icon: (
                        <ClipboardList
                            size={18}
                            className="text-blue-400"
                        />
                    ),

                    color:
                        "bg-orange-500/10 border-orange-500/20"
                };

            case "TASK_ATTACHMENT":

                return {

                    icon: (
                        <Paperclip
                            size={18}
                            className="text-emerald-400"
                        />
                    ),

                    color:
                        "bg-orange-500/10 border-orange-500/20"

                };

            case "CHAT_REQUEST":

                return {

                    icon: (
                        <MessageCircle
                            size={18}
                            className="text-sky-400"
                        />
                    ),

                    color:
                        "bg-violet-500/10 border-violet-500/20"
                };

            case "CHAT_REQUEST_ACCEPTED":

                return {

                    icon: (
                        <CheckCircle2
                            size={18}
                            className="text-emerald-400"
                        />
                    ),

                    color:
                        "bg-violet-500/10 border-violet-500/20"
                };

            case "CHAT_REQUEST_REJECTED":

                return {

                    icon: (
                        <XCircle
                            size={18}
                            className="text-rose-400"
                        />
                    ),

                    color:
                        "bg-violet-500/10 border-violet-500/20"
                };

            default:

                return {

                    icon: (
                        <Bell
                            size={18}
                            className="text-cyan-400"
                        />
                    ),

                    color:
                        "bg-slate-700/20 border-slate-600/30"
                };

        }

    };

    const config = getConfig();

    const handleOpen = async () => {

        if (!notification.referenceId) return;

        if (!notification.isRead) {

            onRead(notification._id);

        }

        switch (notification.type) {

            case "TEAM_INVITE":

                return;

            case "PROJECT_LIKED":
            case "PROJECT_COMMENTED":
            case "PROJECT_DELETED":

                navigate(
                    `/projects/${notification.referenceId}`
                );

                break;

            case "APPLICATION_RECEIVED":
            case "APPLICATION_ACCEPTED":
            case "APPLICATION_REJECTED":

                navigate(
                    `/recruitments/${notification.referenceId}`
                );

                break;

            case "TEAM_INVITE_ACCEPTED":
            case "TEAM_INVITE_REJECTED":
            case "TEAM_JOINED":
            case "TEAM_REMOVED":
            case "TEAM_DELETED":
            case "TEAM_RESOURCE":
            case "TEAM_ANNOUNCEMENT":

                navigate(
                    `/teams/${notification.referenceId}`
                );

                break;

            case "TASK_ASSIGNED":
            case "TASK_ATTACHMENT":
            case "TASK_ATTACHMENT_REMOVED":

                navigate("/teams");

                break;

            case "CHAT_REQUEST":

                navigate("/chats", {

                    state: {

                        openRequests: true

                    }

                });

                break;

            case "CHAT_REQUEST_ACCEPTED":

                navigate("/chats", {

                    state: {

                        conversationId:
                            notification.referenceId

                    }

                });

                break;

            case "CHAT_REQUEST_REJECTED":

                navigate("/chats", {

                    state: {

                        openRequests: true

                    }

                });

                break;

            default:

                break;

        }

    };

    const handleAcceptInvite = async (e) => {

        e.stopPropagation();

        try {

            await acceptTeamInvitation(
                notification.referenceId
            );

            dispatch(
                fetchNotifications()
            );

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleRejectInvite = async (e) => {

        e.stopPropagation();

        try {

            await rejectTeamInvitation(
                notification.referenceId
            );

            dispatch(
                fetchNotifications()
            );

        }

        catch (err) {

            console.log(err);

        }

    };
    const getModuleLabel = () => {

        switch (notification.type) {

            case "PROJECT_LIKED":
            case "PROJECT_COMMENTED":
            case "PROJECT_DELETED":
                return {
                    label: "PROJECT",
                    color: "bg-pink-500/10 text-pink-400"
                };

            case "APPLICATION_RECEIVED":
            case "APPLICATION_ACCEPTED":
            case "APPLICATION_REJECTED":
                return {
                    label: "RECRUITMENT",
                    color: "bg-emerald-500/10 text-emerald-400"
                };

            case "TEAM_INVITE":
            case "TEAM_INVITE_ACCEPTED":
            case "TEAM_INVITE_REJECTED":
            case "TEAM_JOINED":
            case "TEAM_REMOVED":
            case "TEAM_RESOURCE":
            case "TEAM_ANNOUNCEMENT":
            case "TEAM_DELETED":
                return {
                    label: "TEAM",
                    color: "bg-blue-500/10 text-blue-400"
                };

            case "TASK_ASSIGNED":
            case "TASK_ATTACHMENT":
            case "TASK_ATTACHMENT_REMOVED":
                return {
                    label: "TASK",
                    color: "bg-orange-500/10 text-orange-400"
                };

            case "CHAT_REQUEST":
            case "CHAT_REQUEST_ACCEPTED":
            case "CHAT_REQUEST_REJECTED":
                return {
                    label: "CHAT",
                    color: "bg-violet-500/10 text-violet-400"
                };

            default:
                return {
                    label: "SYSTEM",
                    color: "bg-slate-700/20 text-slate-300"
                };

        }

    };

    const moduleInfo = getModuleLabel();

    return (

        <div
            onClick={handleOpen}
            className={`
            rounded-2xl
            border
            ${config.color}
            p-5
            cursor-pointer
            hover:border-blue-400/40
            hover:scale-[1.01]
hover:shadow-lg
hover:shadow-black/20
       
            transition-all
            duration-300
        `}
        >

            <div className="flex gap-4">

                <div
                    className="
                h-12
                w-12

                rounded-xl

                flex
                items-center
                justify-center

                bg-slate-900
                "
                >

                    {config.icon}

                </div>

                <div className="flex-1">

                    <div className="flex justify-between items-start">

                        <div>

                            <h3 className="font-semibold text-white">

                                {notification.sender?.fullName || "DevLink"}

                            </h3>
                            <span
                                className={`
        inline-flex
        mt-2
        px-2.5
        py-1
        rounded-full
        text-[10px]
        font-semibold
        tracking-wider
        ${moduleInfo.color}
    `}
                            >
                                {moduleInfo.label}
                            </span>

                            <p className="mt-2 text-slate-300">

                                {notification.message}

                            </p>

                        </div>

                        {

                            !notification.isRead && (

                                <div
                                    className="
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-cyan-400
                                "
                                />

                            )

                        }

                    </div>

                    <div className="mt-5 flex items-center justify-between">

                        <div
                            className="
                        flex
                        items-center
                        gap-2

                        text-slate-500
                        text-sm
                        "
                        >

                            <Clock size={14} />

                            {

                                formatDistanceToNow(

                                    new Date(notification.createdAt),

                                    {

                                        addSuffix: true

                                    }

                                )

                            }

                        </div>

                        <div
                            className="flex gap-2"
                            onClick={e => e.stopPropagation()}
                        >

                            {

                                notification.type === "TEAM_INVITE"

                                    ?

                                    <>

                                        <button

                                            onClick={handleAcceptInvite}

                                            className="
                                        px-4
                                        py-2

                                        rounded-xl

                                        bg-green-500/10

                                        text-green-400

                                        hover:bg-green-500/20

                                        transition
                                        "

                                        >

                                            Accept

                                        </button>

                                        <button

                                            onClick={handleRejectInvite}

                                            className="
                                        px-4
                                        py-2

                                        rounded-xl

                                        bg-red-500/10

                                        text-red-400

                                        hover:bg-red-500/20

                                        transition
                                        "

                                        >

                                            Decline

                                        </button>

                                    </>

                                    :

                                    <>

                                        {

                                            !notification.isRead && (

                                                <button

                                                    onClick={() =>
                                                        onRead(notification._id)
                                                    }

                                                    className="
                                                px-3
                                                py-2

                                                rounded-xl

                                                bg-cyan-500/10

                                                text-cyan-300

                                                hover:bg-cyan-500/20
                                                "

                                                >

                                                    <Check size={16} />

                                                </button>

                                            )

                                        }

                                        <button

                                            onClick={() =>
                                                onDelete(notification._id)
                                            }

                                            className="
                                        px-3
                                        py-2

                                        rounded-xl

                                        bg-red-500/10

                                        text-red-400

                                        hover:bg-red-500/20
                                        "

                                        >

                                            <Trash2 size={16} />

                                        </button>

                                    </>

                            }

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default NotificationCard;