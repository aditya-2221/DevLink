import { useSelector } from "react-redux";
import {
    FaGithub,
    FaLinkedin,
    FaGlobe,
    FaMapMarkerAlt,
} from "react-icons/fa";

function ProfileHeader({
    onEdit,
    onLinkProfiles,
    stats
}) {
    const { user } = useSelector(
        (state) => state.auth
    );

    const hasSocials = user?.github || user?.linkedin || user?.portfolio;

    return (
        <div
            className="
      bg-slate-900/40
      border
      border-blue-500/10
      rounded-3xl
      overflow-hidden
      "
        >
            {/* Cover */}

            <div className="relative h-32">

                <img
                    src={user?.coverImage}
                    alt="cover"
                    className="
          w-full
          h-full
          object-cover
          "
                />

                <div
                    className="
          absolute
          inset-0
          bg-gradient-to-t
          from-slate-950
          via-slate-950/40
          to-transparent
          "
                />
            </div>

            {/* Content */}
            <div className="flex justify-between items-start px-8 pb-2">
                <div className="relative flex-1">


                    <img
                        src={user?.avatar}
                        alt={user?.fullName}
                        className="
    w-32
    h-32
    rounded-full
    border-4
    border-slate-950
    object-cover
    absolute
    left-8
    -top-20
    z-10
    "
                    />


                    <div className="pt-20">

                        <h1
                            className="
                text-2xl
                font-bold
                text-white
                "
                        >
                            {user?.fullName}
                        </h1>

                        <p className="text-slate-400 mt-1">
                            @{user?.username}
                        </p>

                        <p className="text-slate-300 mt-4">
                            {user?.bio || "No bio added yet."}
                        </p>
                        <div className="flex gap-2 mt-3">

                            {!user?.github && (
                                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs">
                                    GitHub Not Connected
                                </span>
                            )}

                            {!user?.linkedin && (
                                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs">
                                    LinkedIn Not Connected
                                </span>
                            )}

                            {!user?.portfolio && (
                                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs">
                                    Portfolio Not Connected
                                </span>
                            )}

                        </div>

                        <div
                            className="
                flex
                flex-wrap
                gap-5
                mt-5
                text-slate-400
                "
                        >
                            {user?.location && (
                                <span className="flex items-center gap-2">
                                    <FaMapMarkerAlt />
                                    {user.location}
                                </span>
                            )}

                            {user?.github && (
                                <a
                                    href={user.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    <FaGithub />
                                    GitHub
                                </a>
                            )}

                            {user?.linkedin && (
                                <a
                                    href={user.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    <FaLinkedin />
                                    LinkedIn
                                </a>
                            )}

                            {user?.portfolio && (
                                <a
                                    href={user.portfolio}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    <FaGlobe />
                                    Portfolio
                                </a>
                            )}
                        </div>

                        <div className="flex gap-6 mt-6">

                            <div
                                className="
  bg-slate-900/60
  border
  border-blue-500/10
  rounded-2xl
  px-5
  py-4
  min-w-[120px]
  "
                            >
                                <h3 className="text-2xl font-bold text-white">
                                    {stats.projects}
                                </h3>

                                <p className="text-slate-400 text-sm">
                                    Projects
                                </p>
                            </div>

                            <div
                                className="
  bg-slate-900/60
  border
  border-blue-500/10
  rounded-2xl
  px-5
  py-4
  min-w-[120px]
  "
                            >
                                <h3 className="text-2xl font-bold text-white">
                                    {stats.likes}
                                </h3>

                                <p className="text-slate-400 text-sm">
                                    Likes
                                </p>
                            </div>

                            <div
                                className="
  bg-slate-900/60
  border
  border-blue-500/10
  rounded-2xl
  px-5
  py-4
  min-w-[120px]
  "
                            >
                                <h3 className="text-2xl font-bold text-white">
                                    {stats.bookmarks}
                                </h3>

                                <p className="text-slate-400 text-sm">
                                    Bookmarks
                                </p>
                            </div>

                        </div>

                    </div>

                </div>
                <div className="flex gap-3 mt-6">

                    <button
                        onClick={onLinkProfiles}
                        className="
    px-5
    py-2.5
    rounded-xl
    bg-blue-600
    hover:bg-blue-500
    text-white
    transition
    "
                    >
                        {hasSocials
                            ? "Manage Links"
                            : "Link Profiles"}
                    </button>

                    <button
                        onClick={onEdit}
                        className="
    px-5
    py-2.5
    rounded-xl
    bg-slate-900/70
    hover:bg-slate-800
    border
    border-blue-500/20
    text-white
    transition
    "
                    >
                        Edit Profile
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ProfileHeader;