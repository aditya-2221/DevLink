import {
    MessageCircle,
    Sparkles,
    Users
} from "lucide-react";

const EmptyState = () => {

    return (

        <div
            className="
                h-full

                flex
                items-center
                justify-center

                px-10
            "
        >

            <div
                className="
                    text-center
                    max-w-lg
                "
            >

                <div
                    className="
                        relative
                        mx-auto

                        mb-10

                        flex
                        h-28
                        w-28

                        items-center
                        justify-center

                        rounded-[32px]

                        bg-gradient-to-br
                        from-blue-500/20
                        to-cyan-500/20

                        border
                        border-blue-500/20
                    "
                >

                    <div
                        className="
                            absolute

                            h-40
                            w-40

                            rounded-full

                            bg-blue-500/10

                            blur-3xl
                        "
                    />

                    <MessageCircle
                        size={42}
                        className="
                            relative
                            text-blue-400
                        "
                    />

                </div>

                <h2
                    className="
                        text-3xl
                        font-bold
                        text-white
                    "
                >

                    Welcome to DevLink Chats

                </h2>

                <p
                    className="
                        mt-5

                        text-lg
                        leading-8

                        text-slate-400
                    "
                >

                    Collaborate with your teammates, discuss ideas,
                    review projects and build together in one place.

                </p>

                <div
                    className="
                        mt-12

                        flex
                        justify-center
                        gap-8
                    "
                >

                    <div
                        className="
                            rounded-2xl

                            border
                            border-slate-800

                            bg-slate-900/70

                            px-6
                            py-5
                        "
                    >

                        <Users
                            size={22}
                            className="
                                mx-auto
                                mb-3
                                text-blue-400
                            "
                        />

                        <p
                            className="
                                text-sm
                                text-slate-300
                            "
                        >

                            Team Conversations

                        </p>

                    </div>

                    <div
                        className="
                            rounded-2xl

                            border
                            border-slate-800

                            bg-slate-900/70

                            px-6
                            py-5
                        "
                    >

                        <Sparkles
                            size={22}
                            className="
                                mx-auto
                                mb-3
                                text-cyan-400
                            "
                        />

                        <p
                            className="
                                text-sm
                                text-slate-300
                            "
                        >

                            Direct Messages

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default EmptyState;