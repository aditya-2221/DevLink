import { Users, Plus } from "lucide-react";

function EmptyTeams({
    title = "No Teams Found",
    description = "Create your first team and start collaborating with developers.",
    buttonText = "Create Team",
    onClick,
}) {

    return (
        <div
            className="
            flex
            flex-col
            items-center
            justify-center

            py-24

            rounded-3xl

            bg-slate-900/40
            border
            border-blue-500/10
            backdrop-blur-xl
            "
        >

            <div
                className="
                w-24
                h-24

                rounded-full

                bg-blue-500/10

                flex
                items-center
                justify-center

                border
                border-blue-500/20

                shadow-[0_0_40px_rgba(37,99,235,0.15)]
                "
            >
                <Users
                    size={42}
                    className="text-blue-400"
                />
            </div>

            <h2
                className="
                mt-8

                text-3xl
                font-bold

                text-white
                "
            >
                {title}
            </h2>

            <p
                className="
                mt-3

                text-slate-400

                text-center

                max-w-md
                "
            >
                {description}
            </p>

            {onClick && (
                <button
                    onClick={onClick}
                    className="
                    mt-8

                    flex
                    items-center
                    gap-2

                    px-6
                    py-3

                    rounded-xl

                    bg-blue-600
                    hover:bg-blue-500

                    text-white

                    transition-all
                    duration-300

                    hover:scale-105
                    "
                >

                    <Plus size={18} />

                    {buttonText}

                </button>
            )}

        </div>
    );

}

export default EmptyTeams;