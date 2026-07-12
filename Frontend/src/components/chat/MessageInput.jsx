import { useRef, useState } from "react";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    clearReplyMessage
} from "../../features/chat/chatSlice";


import {
    Image,
    Paperclip,
    Send,
    Smile,
    X
} from "lucide-react";

const MessageInput = ({
    conversation,
    onSend,
    onTypingStart,
    onTypingStop
}) => {

    const [message, setMessage] = useState("");
    const dispatch = useDispatch();

    const {
        replyMessage
    } = useSelector(
        state => state.chat
    );
    const [attachments, setAttachments] = useState([]);

    const fileInputRef = useRef(null);
    const typingTimeout = useRef(null);

    const handleTyping = (value) => {

        setMessage(value);

        onTypingStart?.(conversation._id);

        if (typingTimeout.current) {

            clearTimeout(
                typingTimeout.current
            );

        }

        typingTimeout.current = setTimeout(() => {

            onTypingStop?.(
                conversation._id
            );

        }, 1000);

    };

    const handleFiles = (event) => {

        const files = Array.from(
            event.target.files
        );

        setAttachments((prev) => [
            ...prev,
            ...files
        ]);

    };

    const removeAttachment = (index) => {

        setAttachments((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        );

    };

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        if (
            !message.trim() &&
            attachments.length === 0
        ) {

            return;

        }

        const formData = new FormData();

        formData.append(
            "content",
            message
        );

        if (replyMessage) {

            formData.append(
                "replyTo",
                replyMessage._id
            );

        }

        attachments.forEach(
            (file) => {

                formData.append(
                    "attachments",
                    file
                );

            }
        );

        await onSend(formData);
        onTypingStop?.(
            conversation._id
        );

        if (typingTimeout.current) {

            clearTimeout(
                typingTimeout.current
            );

        }

        setMessage("");

        setAttachments([]);

        dispatch(
            clearReplyMessage()
        );

        if (fileInputRef.current) {

            fileInputRef.current.value = "";

        }

    };

    return (

        <div
            className="
px-8
pb-6
pt-2
"
        >

            {

                replyMessage && (

                    <div
                        className="
                mb-4
                rounded-2xl
border-l-[5px]                
bg-slate-900/90
backdrop-blur-xl
border
border-slate-800
                px-4
                py-3
                flex
                justify-between
                items-start
            "
                    >

                        <div>

                            <p
                                className="
                        text-[11px]
uppercase
tracking-widest
font-semibold
text-blue-400
                    "
                            >

                                Replying to{" "}

                                <span
                                    className="
                            font-semibold
                        "
                                >

                                    {
                                        replyMessage.sender
                                            ?.fullName
                                    }

                                </span>

                            </p>

                            <p
                                className="
                        text-sm
                        truncate
                    "
                            >

                                {
                                    replyMessage.content
                                }

                            </p>

                        </div>

                        <button
                            onClick={() =>
                                dispatch(
                                    clearReplyMessage()
                                )
                            }
                        >

                            <X size={18} />

                        </button>

                    </div>

                )

            }

            {

                attachments.length > 0 && (

                    <div
                        className="
                            mb-4
                            flex
                            flex-wrap
                            gap-2
                        "
                    >

                        {

                            attachments.map(
                                (
                                    file,
                                    index
                                ) => (

                                    <div
                                        key={index}
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            rounded-2xl
border
border-slate-800
bg-slate-900/70
backdrop-blur
hover:border-blue-500/40
transition-all
                                            px-3
                                            py-2
                                        "
                                    >

                                        <Paperclip
                                            size={15}
                                        />

                                        <span
                                            className="
                                                max-w-[180px]
                                                truncate
                                                text-sm
                                            "
                                        >

                                            {
                                                file.name
                                            }

                                        </span>

                                        <button
                                            onClick={() =>
                                                removeAttachment(
                                                    index
                                                )
                                            }
                                        >

                                            <X
                                                size={
                                                    15
                                                }
                                            />

                                        </button>

                                    </div>

                                )
                            )

                        }

                    </div>

                )

            }

            <form
                onSubmit={
                    handleSubmit
                }
                className="
                    relative

rounded-[28px]

border
border-slate-800

bg-slate-900/80

backdrop-blur-xl

shadow-xl
shadow-blue-950/10

px-5
py-4

flex
items-end
gap-4
                "
            >

                <button
                    type="button"
                    className="
                        p-3
                       rounded-xl

text-slate-400

hover:bg-blue-500/10

hover:text-blue-400

transition-all
                    "
                >

                    <Smile
                        size={20}
                    />

                </button>

                <textarea
                    rows={1}
                    value={message}
                    onChange={(e) =>
                        handleTyping(
                            e.target.value
                        )
                    }
                    placeholder={`Message ${conversation.type ===
                        "group"
                        ? conversation.name
                        : ""
                        }`}
                    className="
                        max-h-36
                        min-h-[48px]
                        flex-1
                        resize-none
                        
                        rounded-2xl
                        border-slate-700
                        bg-transparent
                        px-2    
py-2
                        outline-none
                        focus:border-blue-500
                        text-[15px]
leading-7
placeholder:text-slate-400
text-white
                    "
                />

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    hidden
                    onChange={
                        handleFiles
                    }

                />

                <button
                    type="button"
                    onClick={() =>
                        fileInputRef.current?.click()
                    }
                    className="
                        rounded-xl
                        p-3
                       

text-slate-400

hover:bg-blue-500/10

hover:text-blue-400

transition-all
                    "
                >

                    <Image
                        size={20}
                    />

                </button>
                <div
                    className="
hidden
lg:block

text-[11px]
text-slate-500
"
                >

                    Shift + Enter for new line

                </div>

                <button
                    type="submit"
                    className="
                        h-12
w-12

rounded-2xl

bg-gradient-to-br
from-blue-500
to-blue-700

shadow-lg
shadow-blue-600/30

hover:scale-105

transition-all
duration-300
                        p-3
                        
                        hover:bg-blue-700
                    "
                >

                    <Send
                        size={20}
                    />

                </button>

            </form>

        </div>

    );

};

export default MessageInput;