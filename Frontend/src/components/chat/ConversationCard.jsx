import {
    CheckCheck,
    Hash
} from "lucide-react";

import { useMemo } from "react";
import { useSelector } from "react-redux";

const ConversationCard = ({
    conversation,
    active,
    unreadCount,
    onClick
}) => {

    const { user } = useSelector(
        state => state.auth
    );

    const { onlineUsers } = useSelector(
        state => state.chat
    );

    const isGroup =
        conversation.type === "group";

    const otherUser =
        useMemo(() => {

            if (isGroup) {
                return null;
            }

            return conversation.participants.find(
                participant =>
                    participant.user._id !==
                    user._id
            )?.user;

        }, [conversation]);

    const avatar = isGroup
        ? conversation.image
        : otherUser?.avatar;

    const title = isGroup
        ? conversation.name
        : otherUser?.fullName;

    const subtitle = conversation.lastMessage?.deleted

        ? "Message deleted"

        : conversation.lastMessage?.content ||
        "Start a conversation";

    const time = conversation.lastMessage
        ? new Date(
            conversation.lastMessage.createdAt
        ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
        : "";

    const online =
        !isGroup &&
        onlineUsers.includes(
            otherUser?._id
        );

    return (

        <button

            onClick={onClick}

            className={`
                relative

                mb-3

                w-full

                rounded-2xl

                p-4

                transition-all
duration-300
ease-out

hover:-translate-y-1
hover:scale-[1.015]
hover:shadow-xl
hover:shadow-blue-500/10

                group

                ${active

                    ? "bg-gradient-to-r from-blue-600/20 to-cyan-500/10 border border-blue-500/40 shadow-lg shadow-blue-500/10"

                    : "hover:bg-slate-900/80 border border-transparent hover:border-slate-800"
                }

            `}
        >

            {

                active && (

                    <div
                        className="
absolute

left-0
top-4

h-12
w-1

rounded-r-full

bg-gradient-to-b
from-cyan-400
to-blue-500

animate-pulse
"
                    />

                )

            }

            <div
                className="
                    flex
                    items-start
                    gap-4
                "
            >

                <div
                    className="
                        relative
                    "
                >

                    {

                        isGroup

                            ?

                            (

                                <div
                                    className="
                                        flex

                                        h-14
                                        w-14

                                        items-center
                                        justify-center

                                        rounded-2xl

                                        bg-blue-600/20

                                        text-blue-400
                                    "
                                >

                                    {

                                        avatar

                                            ?

                                            <img

                                                src={avatar}

                                                alt=""

                                                className="
                                                    h-full
                                                    w-full
                                                    rounded-2xl
                                                    object-cover
                                                "

                                            />

                                            :

                                            <Hash
                                                size={24}
                                            />

                                    }

                                </div>

                            )

                            :

                            (

                                <img

                                    src={avatar}

                                    alt=""

                                    className="
                                        h-14
                                        w-14

                                        rounded-2xl

                                        object-cover
                                    "

                                />

                            )

                    }

                    {

                        online && (

                            <div
                                className="
                                    absolute

                                    bottom-0
                                    right-0

                                    h-4
                                    w-4

                                    rounded-full

                                    border-2
                                    border-slate-950

                                    bg-green-500
                                "
                            />

                        )

                    }

                </div>

                <div
                    className="
                        flex-1
                        min-w-0
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
                        "
                    >

                        <h3
                            className="
                                truncate

                                text-[15px]
                                font-semibold
                                text-white
                            "
                        >

                            {title}

                        </h3>

                        <span
                            className="
                                text-[11px]
                                text-slate-300
                                whitespace-nowrap
                            "
                        >

                            {time}

                        </span>

                    </div>

                    <div
                        className="
        mt-2
        flex
        items-center
        justify-between
        gap-3
    "
                    >

                        <div
                            className="
            flex
            items-center
            gap-2
            min-w-0
        "
                        >

                            {

                                conversation.lastMessage?.sender?._id ===
                                user._id && (

                                    <CheckCheck
                                        size={14}
                                        className="
                        text-blue-400
                        shrink-0
                    "
                                    />

                                )

                            }

                            <p
                                className="
                truncate
                text-sm
                text-slate-300
            "
                            >

                                {subtitle}

                            </p>

                        </div>

                        {

                            unreadCount > 0 && (

                                <div
                                    className="
                    flex
                    h-6
                    min-w-[24px]
                    items-center
                    justify-center
                    rounded-full
                    px-2
                    bg-blue-600
                    text-xs
                    font-semibold
                    text-white
                    shrink-0
                "
                                >

                                    {unreadCount}

                                </div>

                            )

                        }

                    </div>

                </div>

            </div>

        </button>

    );

};

export default ConversationCard;