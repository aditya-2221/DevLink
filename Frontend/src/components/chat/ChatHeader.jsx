import {
    Hash,
    Info,
    Phone,
    Search,
    Video
} from "lucide-react";

import { useMemo } from "react";
import { useSelector } from "react-redux";

const ChatHeader = ({
    conversation,
    onOpenInfo
}) => {

    const { user } = useSelector(
        state => state.auth
    );

    const { onlineUsers } = useSelector(
        state => state.chat
    );

    if (!conversation) {
        return null;
    }

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

    const online =
        !isGroup &&
        onlineUsers.includes(
            otherUser?._id
        );

    return (

        <header
            className="
                h-24

                border-b
                border-slate-800/80

                bg-slate-950/60
                backdrop-blur-xl

                px-8

                flex
                items-center
                justify-between

                shrink-0
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-5
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
                                        h-16
                                        w-16

                                        rounded-2xl

                                        bg-blue-600/20

                                        flex
                                        items-center
                                        justify-center

                                        overflow-hidden
                                    "
                                >

                                    {

                                        conversation.image

                                            ?

                                            <img
                                                src={
                                                    conversation.image
                                                }
                                                alt=""
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                "
                                            />

                                            :

                                            <Hash
                                                size={28}
                                                className="
                                                    text-blue-400
                                                "
                                            />

                                    }

                                </div>

                            )

                            :

                            (

                                <img

                                    src={
                                        otherUser?.avatar
                                    }

                                    alt=""

                                    className="
                                        h-16
                                        w-16

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

                                    h-5
                                    w-5

                                    rounded-full

                                    border-4
                                    border-slate-950

                                    bg-green-500
                                "
                            />

                        )

                    }

                </div>

                <div>

                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-white
                        "
                    >

                        {

                            isGroup

                                ? conversation.name

                                : otherUser?.fullName

                        }

                    </h2>

                    {

                        isGroup

                            ?

                            (

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-slate-400
                                    "
                                >

                                    {

                                        conversation.participants.length

                                    }

                                    {" "}
                                    Members

                                </p>

                            )

                            :

                            (

                                <div
                                    className="
                                        mt-2

                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <div
                                        className={`
                                            h-2.5
                                            w-2.5
                                            rounded-full

                                            ${
                                                online

                                                    ? "bg-green-500"

                                                    : "bg-slate-500"
                                            }
                                        `}
                                    />

                                    <span
                                        className="
                                            text-sm
                                            text-slate-300
                                        "
                                    >

                                        {

                                            online

                                                ? "Online"

                                                : "Offline"

                                        }

                                    </span>

                                </div>

                            )

                    }

                </div>

            </div>

            

        </header>

    );

};

export default ChatHeader;