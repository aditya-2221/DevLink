import {
    MessageCirclePlus,
    Search,
    Users,
    UserRound
} from "lucide-react";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import ConversationCard from "./ConversationCard";


const ConversationSidebar = ({
    onConversationSelect,
    onOpenRequests
}) => {
    const { pendingRequests } = useSelector(
    state => state.chat
);

    const [search, setSearch] =
        useState("");

    const {

        teamChats,

        directChats,

        currentConversation,

        unreadCounts

    } = useSelector(
        state => state.chat
    );

    const filteredTeamChats =
        useMemo(() => {

            return teamChats.filter(
                conversation =>

                    conversation.name
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )

            );

        }, [teamChats, search]);

    const filteredDirectChats =
        useMemo(() => {

            return directChats.filter(
                conversation => {

                    const other =
                        conversation.participants?.find(
                            participant =>
                                !participant.isSelf
                        );

                    return other?.user?.fullName
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        );

                }
            );

        }, [directChats, search]);

    return (

        <aside
            className="
                w-[360px]

                border-r
                border-slate-800

                bg-slate-950/80
                backdrop-blur-xl

                flex
                flex-col
            "
        >

            <div
                className="
                    p-6

                    border-b
                    border-slate-800
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div>

                        <h1
                            className="
                                text-2xl
                                font-bold
                                text-white
                            "
                        >

                            Chats

                        </h1>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-300
                            "
                        >

                            Collaborate with your team

                        </p>

                    </div>

                    <div className="relative">

                        <button

                            onClick={onOpenRequests}

                            className="
            h-11
            w-11

            rounded-xl

            bg-blue-600

            flex
            items-center
            justify-center

            hover:bg-blue-500

            transition
        "
                        >

                            <MessageCirclePlus size={20} />

                        </button>

                        {pendingRequests.length > 0 && (

                            <span
                                className="
                absolute

                -top-1.5
                -right-1.5

                min-w-5
                h-5

                px-1

                rounded-full

                bg-red-500

                border-2
                border-slate-950

                flex
                items-center
                justify-center

                text-[10px]
                font-bold
                text-white

                leading-none
            "
                            >
                                {pendingRequests.length > 99
                                    ? "99+"
                                    : pendingRequests.length}
                            </span>

                        )}

                    </div>

                </div>

                <div
                    className="
                        mt-6    
                        
                        
                        relative
                    "
                >

                    <Search
                        size={18}
                        className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-slate-100
                        "
                    />

                    <input

                        value={search}

                        onChange={e =>
                            setSearch(
                                e.target.value
                            )
                        }

                        placeholder="Search chats..."

                        className="
                            w-full
                            placeholder:text-slate-400
                            rounded-2xl

                            border
                            border-slate-800
                        
                            bg-slate-900/80

                            py-3
                            pl-11
                            pr-4

                            text-sm

                            outline-none

                            focus:border-blue-500

                            transition
                        "
                    />

                </div>

            </div>

            <div
                className="
                    flex-1

                    overflow-y-auto
                "
            >

                <div
                    className="
                        p-5
                    "
                >

                    <div
                        className="
                            mb-5

                            flex
                            items-center
                            gap-2

                            text-xs
                            font-semibold
                            tracking-widest
                            text-slate-300
                        "
                    >

                        <Users
                            size={15}
                        />

                        TEAM CHATS

                    </div>

                    {

                        filteredTeamChats.length === 0

                            ?

                            <p
                                className="
                                    px-2
                                    text-sm
                                    text-slate-500
                                "
                            >

                                No team chats

                            </p>

                            :

                            filteredTeamChats.map(
                                conversation => (

                                    <ConversationCard

                                        key={
                                            conversation._id
                                        }

                                        conversation={
                                            conversation
                                        }

                                        active={
                                            currentConversation?._id ===
                                            conversation._id
                                        }

                                        unreadCount={
                                            unreadCounts[
                                            conversation._id
                                            ] || 0
                                        }

                                        onClick={() =>
                                            onConversationSelect(
                                                conversation
                                            )
                                        }

                                    />

                                )
                            )

                    }

                </div>

                <div
                    className="
                        px-5
                        pb-6
                    "
                >

                    <div
                        className="
                            mb-5

                            flex
                            items-center
                            gap-2

                            text-xs
                            font-semibold
                            tracking-widest
                            text-slate-300
                        "
                    >

                        <UserRound
                            size={15}
                        />

                        DIRECT MESSAGES

                    </div>

                    {

                        filteredDirectChats.length === 0

                            ?

                            <p
                                className="
                                    px-2
                                    text-sm
                                    text-slate-500
                                "
                            >

                                No conversations

                            </p>

                            :

                            filteredDirectChats.map(
                                conversation => (

                                    <ConversationCard

                                        key={
                                            conversation._id
                                        }

                                        conversation={
                                            conversation
                                        }

                                        active={
                                            currentConversation?._id ===
                                            conversation._id
                                        }

                                        unreadCount={
                                            unreadCounts[
                                            conversation._id
                                            ] || 0
                                        }

                                        onClick={() =>
                                            onConversationSelect(
                                                conversation
                                            )
                                        }

                                    />

                                )
                            )

                    }

                </div>

            </div>

        </aside>

    );

};

export default ConversationSidebar;