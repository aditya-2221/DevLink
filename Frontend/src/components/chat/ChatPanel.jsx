import { useSelector } from "react-redux";


import ChatHeader from "./ChatHeader";
import EmptyState from "./EmptyState";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const ChatPanel = ({
    onSend,
    onLoadMore,
    onEditMessage,
    onDeleteMessage,
    onOpenInfo,
    onStartTyping,
    onStopTyping
}) => {

    const {
        currentConversation,
        messages,
        messageLoading
    } = useSelector(
        state => state.chat
    );

    if (!currentConversation) {

        return (

            <div
                className="
                    flex-1
                    flex
                    items-center
                    justify-center
                    relative
                    overflow-hidden
                "
            >

                <div
                    className="
                        absolute
                        inset-0

                        bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08),transparent_60%)]
                    "
                />

                <div
                    className="
                        relative
                        z-10
                    "
                >

                    <EmptyState />

                </div>

            </div>

        );

    }

    return (

        <div
            className="
                h-full

                flex
                flex-col

                relative

                overflow-hidden
            "
        >

            <ChatHeader

                conversation={
                    currentConversation
                }

                onOpenInfo={
                    onOpenInfo
                }

            />

            <div
                className="
                    flex-1

                    px-8
                    pt-6

                    overflow-hidden

                    relative
                "
            >

                <div
                    className="
                        absolute
                        inset-0

                        pointer-events-none

                        bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_50%)]
                    "
                />

                <div
                    className="
                        relative

                        h-full

                        rounded-[28px]

                        border
                        border-slate-800/80

                        bg-slate-950/30

                        backdrop-blur-xl

                        overflow-hidden
                    "
                >

                    <MessageList

                        messages={messages}

                        loading={messageLoading}

                        onLoadMore={onLoadMore}

                        onEditMessage={
                            onEditMessage
                        }

                        onDeleteMessage={
                            onDeleteMessage
                        }

                    />

                </div>

            </div>

            <div
                className="
                    px-8
                    py-6
                "
            >

                <MessageInput
                    conversation={currentConversation}
                    onSend={onSend}
                    onTypingStart={onStartTyping}
                    onTypingStop={onStopTyping}
                />

            </div>

        </div>

    );

};

export default ChatPanel;