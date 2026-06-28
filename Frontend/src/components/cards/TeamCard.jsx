import { useNavigate } from "react-router-dom";
import {
    Users,
    FolderGit2,
    Calendar,
    ArrowUpRight,
    Crown,
} from "lucide-react";

function TeamCard({ team }) {

    const navigate = useNavigate();

    const ownerHandler = () => {
        navigate(`/profile/${team?.owner?.username}`);
    };

    return (

        <div
            className="
            group
            relative
            overflow-hidden

            bg-slate-900/50
            backdrop-blur-xl

            border
            border-blue-500/10

            rounded-2xl
            p-6

            hover:border-blue-500/30
            hover:-translate-y-3
hover:scale-[1.02]
hover:shadow-[0_20px_60px_rgba(37,99,235,0.25)]
            transition-all
            duration-300
            "
        >
            

            {/* Glow */}

            <div
                className="
                absolute
                inset-0

                opacity-0
                group-hover:opacity-100

                transition

                bg-gradient-to-br
                from-blue-500/5
                via-transparent
                to-cyan-500/5
                pointer-events-none
                "
            />

            {/* Header */}

            <div className="flex justify-between items-start">

                <div>

                    <h2
                        className="
                        text-white
                        text-2xl
                        font-semibold
                        "
                    >
                        {team?.name}
                    </h2>

                    <p
                        className="
                        text-slate-400
                        mt-2
                        text-sm
                        line-clamp-2
                        "
                    >
                        {team?.description || "No description provided."}
                    </p>

                </div>

                <div
                    className="
                    h-12
                    w-12

                    rounded-xl

                   bg-gradient-to-r
from-blue-500/15
to-cyan-500/10

                    flex
                    items-center
                    justify-center

                    border
                    border-blue-500/20
                    "
                >

                    <Users
                        className="
                        text-blue-400
                        "
                    />

                </div>

            </div>

            {/* Stats */}

            <div
                className="
                mt-6
                grid
                grid-cols-2
                gap-4
                "
            >

                <div
                    className="
                    flex
                    items-center
                    gap-2
                    text-slate-300
                    text-sm
                    "
                >

                    <Users size={17} />

                    <span>

                        {team?.members?.length || 0} Members

                    </span>

                </div>

                <div
                    className="
                    flex
                    items-center
                    gap-2
                    text-slate-300
                    text-sm
                    "
                >

                    <FolderGit2 size={17} />

                    <span>

                        {team?.project?.title || "No Project"}

                    </span>

                </div>

            </div>

            {/* Owner */}

            <div
                className="
                mt-6

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

                        src={team?.owner?.avatar}

                        alt={team?.owner?.username}

                        onClick={ownerHandler}

                        className="
                        w-11
                        h-11

                        rounded-full

                        object-cover

                        border
                        border-blue-500/20

                        cursor-pointer
                        "
                    />

                    <div>

                        <div
                            className="
                            flex
                            items-center
                            gap-2
                            "
                        >

                            <p
                                className="
                                text-white
                                text-sm
                                font-medium
                                "
                            >
                                {team?.owner?.fullName}
                            </p>

                            <Crown
                                size={14}
                                className="
                                text-yellow-400
                                "
                            />

                        </div>

                        <p
                            className="
                            text-slate-400
                            text-xs
                            "
                        >
                            @{team?.owner?.username}
                        </p>

                    </div>

                </div>

                <button

                    onClick={() =>
                        navigate(`/teams/${team._id}`)
                    }

                    className="
                    flex
                    items-center
                    gap-2

                    px-4
                    py-2

                    rounded-lg

                    bg-blue-600
                    hover:bg-blue-500

                    text-white

                    transition
                    "
                >

                    Open

                    <ArrowUpRight
                        size={16}
                    />

                </button>

            </div>

            {/* Footer */}

            <div
                className="
                mt-6
                pt-5

                border-t
                border-blue-500/10

                flex
                items-center
                justify-between
                "
            >

                <div
                    className="
                    flex
                    items-center
                    gap-2

                    text-slate-500
                    text-sm
                    "
                >

                    <Calendar size={15} />

                    {new Date(
                        team.createdAt
                    ).toLocaleDateString()}

                </div>

                <span
                    className="
                    px-3
                    py-1

                    rounded-full

                   bg-gradient-to-r
                from-emerald-500/15
                to-green-500/10

                    text-green-400

                    border
                    border-green-500/20

                    text-xs
                    "
                >

                    Active

                </span>

            </div>

        </div>

    );

}

export default TeamCard;