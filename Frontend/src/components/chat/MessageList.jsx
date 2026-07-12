import { useEffect, useMemo, useRef } from "react";
import { format, isSameDay } from "date-fns";
import { useSelector } from "react-redux";

import MessageBubble from "./MessageBubble";

const MessageList = ({
    messages,
    loading,
    onLoadMore,
    onEditMessage,
    onDeleteMessage
}) => {

    const containerRef = useRef(null);
    const { typingUsers } = useSelector(
        state => state.chat
    );

    useEffect(() => {

        if (!containerRef.current) return;

        containerRef.current.scrollTop =
            containerRef.current.scrollHeight;

    }, [messages]);

    const handleScroll = () => {

        if (!containerRef.current) return;

        if (
            containerRef.current.scrollTop < 80 &&
            onLoadMore
        ) {

            onLoadMore();

        }

    };

    const groupedMessages =
        useMemo(() => {

            return messages.map(
                (
                    message,
                    index
                ) => {

                    const previous =
                        messages[index - 1];

                    const newGroup =

                        !previous ||

                        previous.sender?._id !==
                        message.sender?._id ||

                        new Date(
                            message.createdAt
                        ).getTime() -

                        new Date(
                            previous.createdAt
                        ).getTime()

                        >

                        5 * 60 * 1000;

                    const showDate =

                        !previous ||

                        !isSameDay(
                            new Date(
                                previous.createdAt
                            ),
                            new Date(
                                message.createdAt
                            )
                        );

                    return {

                        ...message,

                        newGroup,

                        showDate

                    };

                }

            );

        }, [messages]);

    if (loading) {

        return (

            <div
                className="
                    flex-1
                    flex
                    items-center
                    justify-center
                "
            >

                <div
                    className="
                        h-10
                        w-10

                        rounded-full

                        border-4
                        border-blue-500/30
                        border-t-blue-500

                        animate-spin
                    "
                />

            </div>

        );

    }

    return (

        <div

            ref={containerRef}

            onScroll={handleScroll}

            className="
                h-full

                overflow-y-auto

                px-10
                py-8

                space-y-1
            "

        >

            {

                groupedMessages.length === 0 && (

                    <div
                        className="
                            h-full
                            flex
                            items-center
                            justify-center
                            text-slate-200
                        "
                    >

                        No messages yet.

                    </div>

                )

            }

            {

                groupedMessages.map(
                    message => (

                        <div
                            key={message._id}
                        >

                            {

                                message.showDate && (

                                    <div
                                        className="
                                            flex
                                            justify-center
                                            my-8
                                        "
                                    >

                                        <span
                                            className="
                                                rounded-full

                                                border
                                                border-slate-800

                                                bg-slate-900/80

                                                px-4
                                                py-1.5

                                                text-xs

                                                uppercase

                                                tracking-widest

                                                text-slate-100
                                            "
                                        >

                                            {

                                                format(
                                                    new Date(
                                                        message.createdAt
                                                    ),
                                                    "MMMM dd, yyyy"
                                                )

                                            }

                                        </span>

                                    </div>

                                )

                            }


                            <MessageBubble

                                message={message}

                                showAvatar={
                                    message.newGroup
                                }

                                onEdit={
                                    onEditMessage
                                }

                                onDelete={
                                    onDeleteMessage
                                }

                            />

                        </div>

                    )

                )

            }
            {
                typingUsers.length > 0 && (

                    <div
                        className="
                mt-4
                flex
                items-center
                gap-3
            "
                    >

                        <div
                            className="
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900/80
                    px-4
                    py-3
                "
                        >

                            <p
                                className="
                        text-sm
                        text-slate-300
                    "
                            >

                                {typingUsers[0].fullName}
                                {" "}
                                is typing

                            </p>

                            <div
                                className="
                        mt-2
                        flex
                        gap-1
                    "
                            >

                                <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" />

                                <span
                                    className="
                            h-2
                            w-2
                            rounded-full
                            bg-blue-400
                            animate-bounce
                            [animation-delay:.2s]
                        "
                                />

                                <span
                                    className="
                            h-2
                            w-2
                            rounded-full
                            bg-blue-400
                            animate-bounce
                            [animation-delay:.4s]
                        "
                                />

                            </div>

                        </div>

                    </div>

                )
            }

        </div>

    );

};

export default MessageList;