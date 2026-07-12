import { format } from "date-fns";
import { MoreVertical, Pencil, Trash2, Reply, Check, CheckCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    setReplyMessage
} from "../../features/chat/chatSlice";

const MessageBubble = ({
    message,
    showAvatar = true,
    onEdit,
    onDelete
}) => {

    const { user } = useSelector(
        (state) => state.auth
    );

    const dispatch = useDispatch();

    const [showMenu, setShowMenu] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editedContent, setEditedContent] = useState("");

    const isMine = useMemo(
        () =>
            message.sender?._id ===
            user?._id,
        [message, user]
    );

    return (

        <div
            className={`flex ${isMine
                ? "justify-end"
                : "justify-start"
                }`}
        >

            <div
                className={`
                    relative
                    max-w-[65%] min-w-[120px]
                    group
                `}
            >

                {

                    !isMine && showAvatar && (

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                mb-1
                            "
                        >

                            <img
                                src={
                                    message.sender
                                        ?.avatar
                                }
                                alt={
                                    message.sender
                                        ?.fullName
                                }
                                className="
h-10
w-10
rounded-2xl
object-cover
ring-2
ring-slate-800
"
                            />

                            <span
                                className="
                                    
                                   text-sm
font-semibold
text-slate-200
                                "
                            >

                                {
                                    message.sender
                                        ?.fullName
                                }

                            </span>

                        </div>

                    )

                }

                {

                    message.replyTo && (

                        <div
                            className="
                                mb-2
                                rounded-2xl
border-l-4
border-blue-500
bg-slate-900/80
backdrop-blur-md
                                px-3
                                py-2
                            "
                        >

                            <p
                                className="
                                    text-[11px]
uppercase
tracking-wider
text-blue-400
font-semibold
                                "
                            >

                                Replying to

                            </p>

                            <p
                                className="
                                    text-sm
                                    truncate
                                "
                            >

                                {
                                    message.replyTo
                                        ?.content
                                }

                            </p>

                        </div>

                    )

                }

                <div
                    className={`
                        rounded-[24px]
                        px-5
py-4

                        ${isMine

                            ? `bg-gradient-to-br
from-blue-600
to-blue-700
shadow-lg
shadow-blue-700/20 text-white`

                            : `bg-slate-900/80
border
border-slate-800
backdrop-blur-lg text-slate-100`
                        }
                    `}
                >

                    {

                        message.deleted

                            ?

                            (

                                <p
                                    className="
                                        italic
                                        opacity-70
                                    "
                                >

                                    This message was deleted

                                </p>

                            )

                            :

                            (

                                <>

                                    {

                                        message.content && (

                                            editing ? (

                                                <div
                                                    className="
    rounded-2xl
    border
    border-slate-700/60
    bg-slate-900/60
    backdrop-blur-xl
    p-4
    space-y-4
"
                                                >

                                                    <div
                                                        className="
                flex
                items-center
                justify-between
            "
                                                    >

                                                        <span
                                                            className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-blue-400
                "
                                                        >
                                                            Editing Message
                                                        </span>

                                                        <span
                                                            className="
                    text-[11px]
                    text-slate-500
                "
                                                        >
                                                            Press Enter to save
                                                        </span>

                                                    </div>

                                                    <textarea
                                                        value={editedContent}
                                                        onChange={(e) =>
                                                            setEditedContent(e.target.value)
                                                        }
                                                        onKeyDown={(e) => {

                                                            if (e.key === "Enter" && !e.shiftKey) {

                                                                e.preventDefault();

                                                                onEdit(
                                                                    message._id,
                                                                    editedContent.trim()
                                                                );

                                                                setEditing(false);

                                                            }

                                                        }}
                                                        autoFocus
                                                        rows={3}
                                                        className="
    w-full
    resize-none
    rounded-xl
    border
    border-slate-700
    bg-slate-950/50
    px-4
    py-3
    text-sm
    text-slate-100
    placeholder:text-slate-500
    outline-none
    transition-all
    duration-200
    focus:border-slate-500
    focus:bg-slate-900/80
"
                                                    />

                                                    <div
                                                        className="
                flex
                items-center
                justify-end
                gap-3
            "
                                                    >

                                                        <button
                                                            onClick={() =>
                                                                setEditing(false)
                                                            }
                                                            className="
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-800
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-slate-300
                    transition-all
                    duration-200
                    hover:bg-slate-700
                    hover:text-white
                "
                                                        >
                                                            Cancel
                                                        </button>

                                                        <button
                                                            onClick={() => {

                                                                onEdit(
                                                                    message._id,
                                                                    editedContent.trim()
                                                                );

                                                                setEditing(false);

                                                            }}
                                                            disabled={!editedContent.trim()}
                                                            className="
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    to-blue-500
                    px-5
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-blue-700/20
                    transition-all
                    duration-200
                    hover:scale-[1.02]
                    hover:shadow-blue-600/30
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
                                                        >
                                                            Save Changes
                                                        </button>

                                                    </div>

                                                </div>

                                            ) : (

                                                <p
                                                    className="
leading-7
whitespace-pre-wrap
break-words
text-[15px]
"
                                                >
                                                    {message.content}
                                                </p>

                                            )

                                        )

                                    }

                                    {

                                        message.attachments
                                            ?.length > 0 && (

                                            <div
                                                className="
                                                        mt-3
                                                        space-y-2
                                                    "
                                            >

                                                {

                                                    message.attachments.map(
                                                        (
                                                            file,
                                                            index
                                                        ) => (

                                                            <a
                                                                key={
                                                                    index
                                                                }

                                                                href={
                                                                    file.url
                                                                }

                                                                target="_blank"

                                                                rel="noreferrer"

                                                                className="
                                                                        rounded-2xl
border
border-slate-700
bg-slate-950/70
hover:border-blue-500/40
transition-all
duration-300
                                                                    "
                                                            >

                                                                {
                                                                    file.name
                                                                }

                                                            </a>

                                                        )
                                                    )

                                                }

                                            </div>

                                        )

                                    }

                                </>

                            )

                    }

                </div>

                <div
                    className={`
        mt-2
        flex
        items-center
        gap-2

        ${isMine
                            ? "justify-end"
                            : "justify-start"
                        }
    `}
                >

                    <span
                        className="
            text-xs
            font-medium
            tracking-wide
            text-slate-400
        "
                    >
                        {format(
                            new Date(message.createdAt),
                            "hh:mm a"
                        )}
                    </span>

                    {

                        isMine && (

                            <>

                                {

                                    message.status === "sent" && (

                                        <Check
                                            size={14}
                                            className="
                                text-slate-400
                            "
                                        />

                                    )

                                }

                                {

                                    message.status === "delivered" && (

                                        <CheckCheck
                                            size={14}
                                            className="
                                text-slate-400
                            "
                                        />

                                    )

                                }

                                {

                                    message.status === "read" && (

                                        <CheckCheck
                                            size={14}
                                            className="
                                text-blue-400
                            "
                                        />

                                    )

                                }

                            </>

                        )

                    }

                    {

                        message.edited && (

                            <span
                                className="
                    rounded-full
                    bg-slate-800

                    px-2
                    py-0.5

                    text-[10px]
                    uppercase
                    tracking-wider

                    text-slate-300
                "
                            >

                                Edited

                            </span>

                        )

                    }

                </div>

                {

                    isMine &&
                    !message.deleted && (

                        <button
                            onClick={() =>
                                setShowMenu(
                                    !showMenu
                                )
                            }
                            className="
                                absolute
                               top-1/2
-right-12
-translate-y-1/2
                                
                                opacity-0

translate-x-2

group-hover:opacity-100

group-hover:translate-x-0

transition-all

duration-300
                                
                                rounded-full
bg-slate-300
border
border-slate-800
p-2
                            "
                        >

                            <MoreVertical
                                size={18}
                            />

                        </button>

                    )

                }

                {

                    showMenu && (

                        <div
                            className="
                                absolute
                                top-7
                                right-0
                                z-20
                                w-40
                                rounded-2xl
                                border
                                border-slate-700
                                bg-slate-200
                                shadow-xl
                                overflow-hidden
                            "
                        >

                            <button
                                onClick={() => {

                                    setEditedContent(message.content);

                                    setEditing(true);

                                    setShowMenu(false);

                                }}
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    w-full
                                    px-4
                                    py-3
                                    hover:bg-slate-400
                                "
                            >

                                <Pencil
                                    size={16}
                                />

                                Edit

                            </button>

                            <button
                                onClick={() => {

                                    dispatch(
                                        setReplyMessage(message)
                                    );

                                    setShowMenu(false);

                                }}

                                className="
        flex
        items-center
        gap-3
        w-full
        px-4
        py-3
        hover:bg-slate-400
    "
                            >

                                <Reply size={16} />

                                Reply

                            </button>

                            <button
                                onClick={() => {

                                    const confirmed =
                                        window.confirm(
                                            "Delete this message?"
                                        );

                                    if (!confirmed) return;

                                    onDelete(message._id);

                                }}
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    w-full
                                    px-4
                                    py-3
                                    text-red-400
                                    hover:bg-slate-400
                                "
                            >

                                <Trash2
                                    size={16}
                                />

                                Delete

                            </button>

                        </div>

                    )

                }

            </div>

        </div>

    );

};

export default MessageBubble;