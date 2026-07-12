import { X, Bell, Archive, ExternalLink, Users, Shield } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ChatInfoDrawer = ({
    open,
    onClose,
    onMute,
    onArchive
}) => {

    const {
        currentConversation,
        onlineUsers
    } = useSelector(
        state => state.chat
    );

    const { user } = useSelector(
        state => state.auth
    );

    if (!open || !currentConversation) {
        return null;
    }

    const isGroup =
        currentConversation.type === "group";

    const otherParticipant =
        !isGroup
            ? currentConversation.participants.find(
                participant =>
                    participant.user._id !== user._id
            )?.user
            : null;

    const isOnline =
        !isGroup &&
        onlineUsers.includes(
            otherParticipant?._id
        );

    return (

        <>

            <div
                onClick={onClose}
                className="
                    fixed
                    inset-0
                    bg-black/40
                    z-40
                "
            />

            <aside
                className="
                    fixed
                    right-0
                    top-0
                    z-50
                    h-screen
                    w-[420px]
                    bg-slate-950
                    border-l
                    border-slate-800
                    flex
                    flex-col
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        p-5
                        border-b
                        border-slate-800
                    "
                >

                    <h2
                        className="
                            text-xl
                            font-semibold
                        "
                    >

                        Chat Details

                    </h2>

                    <button
                        onClick={onClose}
                    >

                        <X size={22} />

                    </button>

                </div>

                <div
                    className="
                        flex-1
                        overflow-y-auto
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            items-center
                            p-8
                            border-b
                            border-slate-800
                        "
                    >

                        <img
                            src={
                                isGroup
                                    ? currentConversation.image
                                    : otherParticipant?.avatar
                            }
                            alt=""
                            className="
                                h-28
                                w-28
                                rounded-full
                                object-cover
                            "
                        />

                        <h3
                            className="
                                mt-4
                                text-2xl
                                font-bold
                            "
                        >

                            {

                                isGroup
                                    ? currentConversation.name
                                    : otherParticipant?.fullName

                            }

                        </h3>

                        {

                            isGroup

                                ?

                                (

                                    <p
                                        className="
                                            mt-2
                                            text-slate-400
                                        "
                                    >

                                        {

                                            currentConversation.participants.length

                                        }

                                        {" "}Members

                                    </p>

                                )

                                :

                                (

                                    <>

                                        <p
                                            className="
                                                mt-2
                                                text-slate-400
                                            "
                                        >

                                            @{

                                                otherParticipant?.username

                                            }

                                        </p>

                                        <span
                                            className={`
                                                mt-3
                                                rounded-full
                                                px-3
                                                py-1
                                                text-xs

                                                ${

                                                    isOnline

                                                        ? "bg-green-600/20 text-green-400"

                                                        : "bg-slate-800 text-slate-400"

                                                }
                                            `}
                                        >

                                            {

                                                isOnline

                                                    ? "Online"

                                                    : "Offline"

                                            }

                                        </span>

                                    </>

                                )

                        }

                    </div>

                    {

                        isGroup && (

                            <div
                                className="
                                    p-5
                                    border-b
                                    border-slate-800
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        mb-4
                                    "
                                >

                                    <Users
                                        size={18}
                                    />

                                    <h4
                                        className="
                                            font-semibold
                                        "
                                    >

                                        Members

                                    </h4>

                                </div>

                                <div
                                    className="
                                        space-y-4
                                    "
                                >

                                    {

                                        currentConversation.participants.map(
                                            participant => (

                                                <div
                                                    key={
                                                        participant.user._id
                                                    }
                                                    className="
                                                        flex
                                                        items-center
                                                        justify-between
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                        "
                                                    >

                                                        <img
                                                            src={
                                                                participant.user.avatar
                                                            }
                                                            alt=""
                                                            className="
                                                                h-10
                                                                w-10
                                                                rounded-full
                                                            "
                                                        />

                                                        <div>

                                                            <p>

                                                                {

                                                                    participant.user.fullName

                                                                }

                                                            </p>

                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-slate-500
                                                                "
                                                            >

                                                                @{

                                                                    participant.user.username

                                                                }

                                                            </p>

                                                        </div>

                                                    </div>

                                                    {

                                                        currentConversation.admins.some(
                                                            admin =>
                                                                admin ===
                                                                participant.user._id
                                                        ) && (

                                                            <Shield
                                                                size={16}
                                                                className="
                                                                    text-blue-400
                                                                "
                                                            />

                                                        )

                                                    }

                                                </div>

                                            )
                                        )

                                    }

                                </div>

                            </div>

                        )

                    }

                    <div
                        className="
                            p-5
                            space-y-3
                        "
                    >

                        {

                            isGroup

                                ?

                                (

                                    <Link
                                        to={`/teams/${currentConversation.team}`}
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            rounded-xl
                                            bg-slate-900
                                            px-4
                                            py-3
                                            hover:bg-slate-800
                                        "
                                    >

                                        Open Team

                                        <ExternalLink
                                            size={18}
                                        />

                                    </Link>

                                )

                                :

                                (

                                    <Link
                                        to={`/profile/${otherParticipant.username}`}
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            rounded-xl
                                            bg-slate-900
                                            px-4
                                            py-3
                                            hover:bg-slate-800
                                        "
                                    >

                                        View Profile

                                        <ExternalLink
                                            size={18}
                                        />

                                    </Link>

                                )

                        }

                        <button
                            onClick={onMute}
                            className="
                                flex
                                w-full
                                items-center
                                justify-between
                                rounded-xl
                                bg-slate-900
                                px-4
                                py-3
                                hover:bg-slate-800
                            "
                        >

                            Mute Conversation

                            <Bell
                                size={18}
                            />

                        </button>

                        <button
                            onClick={onArchive}
                            className="
                                flex
                                w-full
                                items-center
                                justify-between
                                rounded-xl
                                bg-slate-900
                                px-4
                                py-3
                                hover:bg-slate-800
                            "
                        >

                            Archive Conversation

                            <Archive
                                size={18}
                            />

                        </button>

                    </div>

                </div>

            </aside>

        </>

    );

};

export default ChatInfoDrawer;