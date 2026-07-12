import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Bell,
    CheckCheck
} from "lucide-react";

import NotificationCard from "../../components/cards/NotificationCard";

import {
    fetchNotifications,
    readNotification,
    readAllNotifications,
    removeNotification
} from "../../features/notifications/notificationSlice";

function Notifications() {

    const dispatch = useDispatch();

    const {
        notifications,
        unreadCount,
        loading
    } = useSelector(
        state => state.notification
    );

    const [activeFilter, setActiveFilter] = useState("ALL");

    useEffect(() => {

        dispatch(
            fetchNotifications()
        );

    }, [dispatch]);

    const filteredNotifications = useMemo(() => {

        switch (activeFilter) {

            case "UNREAD":

                return notifications.filter(
                    notification => !notification.isRead
                );

            case "READ":

                return notifications.filter(
                    notification => notification.isRead
                );

            default:

                return notifications;

        }

    }, [
        notifications,
        activeFilter
    ]);

    const handleRead = (notificationId) => {

        dispatch(
            readNotification(notificationId)
        );

    };

    const handleDelete = (notificationId) => {

        dispatch(
            removeNotification(notificationId)
        );

    };

    const handleReadAll = () => {

        dispatch(
            readAllNotifications()
        );

    };

    return (

        <div className="space-y-8">

            <div className="flex items-center justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <Bell
                            size={28}
                            className="text-cyan-400"
                        />

                        <h1 className="text-3xl font-bold text-white">

                            Notifications

                        </h1>

                    </div>

                    <p className="mt-2 text-slate-400">

                        Stay updated with everything happening in DevLink.

                    </p>

                </div>

                <button

                    disabled={unreadCount === 0}

                    onClick={handleReadAll}

                    className="
                        flex
                        items-center
                        gap-2

                        rounded-xl

                        bg-cyan-500/10

                        border
                        border-cyan-500/20

                        px-5
                        py-3

                        text-cyan-300

                        disabled:opacity-50

                        hover:bg-cyan-500/20

                        transition
                    "

                >

                    <CheckCheck size={18} />

                    Mark All Read

                </button>

            </div>

            <div className="flex gap-3">

                {[
                    "ALL",
                    "UNREAD",
                    "READ"
                ].map(filter => (

                    <button

                        key={filter}

                        onClick={() =>
                            setActiveFilter(filter)
                        }

                        className={`
                            rounded-xl

                            px-5
                            py-3

                            transition

                            ${
                                activeFilter === filter

                                    ?

                                    "bg-blue-600 text-white"

                                    :

                                    "bg-slate-900 text-slate-400 hover:bg-slate-800"
                            }
                        `}

                    >

                        {filter === "ALL"
                            ? "All"
                            : filter === "UNREAD"
                                ? "Unread"
                                : "Read"
                        }

                    </button>

                ))}

            </div>

            {

                loading ?

                    (

                        <div className="py-20 text-center text-slate-400">

                            Loading notifications...

                        </div>

                    )

                    :

                    filteredNotifications.length === 0 ?

                        (

                            <div
                                className="
                                    rounded-3xl

                                    border
                                    border-dashed
                                    border-slate-700

                                    bg-slate-900/40

                                    py-24

                                    text-center
                                "
                            >

                                <Bell
                                    size={60}
                                    className="
                                        mx-auto

                                        text-slate-600
                                    "
                                />

                                <h2
                                    className="
                                        mt-6

                                        text-2xl

                                        font-semibold

                                        text-white
                                    "
                                >

                                    No Notifications

                                </h2>

                                <p className="mt-3 text-slate-500">

                                    You're all caught up.

                                </p>

                            </div>

                        )

                        :

                        (

                            <div className="space-y-5">

                                {

                                    filteredNotifications.map(notification => (

                                        <NotificationCard

                                            key={notification._id}

                                            notification={notification}

                                            onRead={handleRead}

                                            onDelete={handleDelete}

                                        />

                                    ))

                                }

                            </div>

                        )

            }

        </div>

    );

}

export default Notifications;