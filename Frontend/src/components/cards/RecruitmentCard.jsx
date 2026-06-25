import { useNavigate } from "react-router-dom";
import {
    Briefcase,
    Users,
    Clock3,
    ArrowUpRight,
} from "lucide-react";

function RecruitmentCard({ recruitment }) {
    const navigate = useNavigate();
    const avatarHandler = () => {
        navigate(`/profile/${recruitment.owner.username}`)
    }

    return (
        <div
            className="
      bg-slate-900/50
      backdrop-blur-xl
      border
      border-blue-500/10
      rounded-xl
      p-5
      hover:-translate-y-1
      hover:shadow-[0_0_25px_rgba(37,99,235,0.15)]
      transition-all
      duration-300
      "
        >

            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-white text-xl font-semibold">
                        {recruitment?.title}
                    </h2>

                    <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                        {recruitment?.description}
                    </p>
                </div>

                <span
                    className={`
          px-3
          py-1
          rounded-full
          text-xs
          font-medium

          ${recruitment?.status === "OPEN"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : recruitment?.status === "CLOSED"
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        }
        `}
                >
                    {recruitment?.status}
                </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
                {recruitment?.requiredSkills?.map(
                    (skill) => (
                        <span
                            key={skill}
                            className="
              px-3
              py-1
              text-xs
              rounded-full
              bg-blue-500/10
              text-blue-300
              border
              border-blue-500/20
              "
                        >
                            {skill}
                        </span>
                    )
                )}
            </div>

            <div className="mt-5 space-y-2">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Briefcase size={16} />
                    <span>
                        {recruitment?.project?.title}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Users size={16} />
                    <span>
                        {recruitment.acceptedCount || 0}/{recruitment.positions} Filled
                    </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Users size={16} />
                    <span>
                        {recruitment?.applicantsCount || 0}  Applicants
                    </span>
                </div>
                <div className="mt-2">

                    <div
                        className="
        h-2
        bg-slate-800
        rounded-full
        overflow-hidden
    "
                    >

                        <div
                            className="
            h-full
            bg-blue-500
            transition-all
            duration-500
        "
                            style={{
                                width: `${Math.min(
                                    (
                                        (
                                            recruitment.acceptedCount || 0
                                        ) /
                                        recruitment.positions
                                    ) * 100,
                                    100
                                )}%`
                            }}
                        />

                    </div>

                    <div
                        className="
        flex
        justify-between
        text-xs
        text-slate-500
        mt-1
    "
                    >
                        <span>Team Filled</span>

                        <span>
                            {recruitment.acceptedCount || 0}
                            /
                            {recruitment.positions}
                        </span>
                    </div>

                </div>

                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Clock3 size={16} />
                    <span>
                        {new Date(
                            recruitment?.createdAt
                        ).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center gap-3">

                    <img
                        src={
                            recruitment?.owner?.avatar
                        }
                        alt={
                            recruitment?.owner?.username
                        }
                        onClick={avatarHandler}
                        className="
        w-10
        h-10
        rounded-full
        object-cover
        border
        border-blue-500/20
        "
                    />

                    <div>
                        <p className="text-white text-sm font-medium">
                            @{recruitment?.owner?.username}
                        </p>

                        <p className="text-slate-400 text-xs">
                            Recruiter
                        </p>
                    </div>

                </div>

                <button
                    onClick={() =>
                        navigate(
                            `/recruitments/${recruitment._id}`
                        )
                    }
                    className="
          flex
          items-center
          gap-2
          px-4
          py-2
          bg-blue-600
          hover:bg-blue-500
          rounded-lg
          text-white
          transition
          "
                >
                    View
                    <ArrowUpRight size={16} />
                </button>
            </div>
        </div>
    );
}

export default RecruitmentCard;