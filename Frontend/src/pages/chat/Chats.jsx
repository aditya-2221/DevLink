import { useEffect, useState } from "react";

import useChat from "../../hooks/useChat";

import ConversationSidebar from "../../components/chat/ConversationSidebar";
import ChatPanel from "../../components/chat/ChatPanel";
import RequestsDrawer from "../../components/chat/RequestsDrawer";
import ChatInfoDrawer from "../../components/chat/ChatInfoDrawer";

const Chats = () => {

    const {

        initializeChat,

        loadConversation,

        sendMessage,

        editMessage,

        deleteMessage,

        loadMoreMessages,

        loadPendingRequests,

        loadSentRequests,

        acceptRequest,

        rejectRequest,

        cancelRequest,

        startTyping,

        stopTyping

    } = useChat();

    const [requestsOpen, setRequestsOpen] =
        useState(false);

    const [infoOpen, setInfoOpen] =
        useState(false);

    useEffect(() => {

        initializeChat();

    }, []);
    const handleOpenInfo = () => {

        setInfoOpen(true);

    };

    return (

        <div
            className="
                h-full

                rounded-[30px]

                overflow-hidden

                border
                border-slate-800/70

                bg-slate-950/50

                backdrop-blur-2xl

                shadow-[0_0_60px_rgba(37,99,235,0.08)]

                flex
            "
        >

            <ConversationSidebar

                onConversationSelect={
                    loadConversation
                }

                onOpenRequests={() => {

                    loadPendingRequests();

                    loadSentRequests();

                    setRequestsOpen(true);

                }}

            />

            <div
                className="
                    relative

                    flex-1

                    overflow-hidden
                "
            >

                <div
                    className="
                        absolute
                        inset-0

                        bg-[radial-gradient(circle_at_top,#0f172a,#020617)]
                    "
                />

                <div
                    className="
                        absolute

                        -top-52
                        left-1/3

                        h-[500px]
                        w-[500px]

                        rounded-full

                        bg-blue-600/10

                        blur-[170px]
                    "
                />

                <div
                    className="
                        absolute

                        bottom-0
                        right-0

                        h-[450px]
                        w-[450px]

                        rounded-full

                        bg-cyan-500/10

                        blur-[170px]
                    "
                />

                <div
                    className="
                        absolute
                        inset-0

                        bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)]
                        animate-[pulse_12s_linear_infinite]

                        bg-[size:40px_40px]

                        opacity-40
                    "
                />

                <div
                    className="
                        relative

                        h-full
                    "
                >

                    <ChatPanel

                        onSend={sendMessage}

                        onLoadMore={loadMoreMessages}

                        onEditMessage={editMessage}

                        onDeleteMessage={deleteMessage}

                        onOpenInfo={handleOpenInfo}

                        onStartTyping={startTyping}

                        onStopTyping={stopTyping}

                    />

                </div>

            </div>

            <RequestsDrawer

                open={requestsOpen}

                onClose={() =>
                    setRequestsOpen(false)
                }

                onAccept={acceptRequest}

                onReject={rejectRequest}

                onCancel={cancelRequest}

            />

            <ChatInfoDrawer

                open={infoOpen}

                onClose={() =>
                    setInfoOpen(false)
                }

            />

        </div>

    );

};

export default Chats;