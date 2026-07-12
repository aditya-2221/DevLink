import { useSelector } from "react-redux";
import {
    FaGithub,
    FaLinkedin,
    FaGlobe,
    FaCode,
    FaMapMarkerAlt,
    FaCheckCircle, FaFolder,
    FaHeart,
    FaBookmark
} from "react-icons/fa";

import { BADGES } from "../../constants/badges"

function ProfileHeader({
    onEdit,
    onLinkProfiles,
    onMessage,
    chatStatus,
    stats,
    user,
    isOwner = false
}) {



    const hasSocials = user?.github || user?.linkedin || user?.portfolio;


    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric",
            }
        )
        : "Recently";

    const getMessageButton = () => {

        if (!chatStatus) {

            return {
                text: "Message",
                disabled: false
            };

        }

        switch (chatStatus.status) {

            case "conversation":

                return {

                    text: "Open Chat",

                    disabled: false

                };

            case "pending":

                if (chatStatus.direction === "sent") {

                    return {

                        text: "Request Sent",

                        disabled: true

                    };

                }

                return {

                    text: "Accept Request",

                    disabled: false

                };

            default:

                return {

                    text: "Message",

                    disabled: false

                };

        }

    };

    const messageButton = getMessageButton();
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

            <div className="relative h-42">

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
  bg-gradient-to-r
  from-slate-950
  via-slate-950/50
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
w-36
h-36
rounded-full
border-4
border-slate-950
ring-4
ring-blue-500/50
shadow-[0_0_40px_rgba(59,130,246,0.35)]
object-cover
absolute
left-8
-top-20
z-10
"
                    />


                    <div className="pt-20">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3">

                                <h1
                                    className="
        text-3xl
        font-bold
        text-white
        "
                                >
                                    {user?.fullName}
                                </h1>

                                {user?.isVerified && (
                                    <FaCheckCircle
                                        title="Verified Profile"
                                        className="
    text-sky-400
    text-lg
    shrink-0
    drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]
    "
                                    />
                                )}
                            </div>

                        </div>

                        <div className="flex items-center gap-3 mt-1">

                            <p className="text-slate-400">
                                @{user?.username}
                            </p>

                            {user?.badges?.length > 0 && (

                                <div
                                    className="
        flex
        flex-wrap
        gap-2
        mt-3
        "
                                >

                                    {user?.badges?.map((badge) => (

                                        <div
                                            key={badge}
                                            className="
        relative
        group
        "
                                        >

                                            <span
                                                className={`
            px-3
            py-1
            rounded-full
            bg-slate-900/60
            border
            border-blue-500/20
            text-xs
            font-medium
            cursor-help
            transition-all
            duration-200
            hover:scale-105
            ${BADGES[badge]?.color}
            `}
                                            >

                                                {BADGES[badge]?.icon}
                                                {" "}
                                                {BADGES[badge]?.label}

                                            </span>

                                            <div
                                                className="
            absolute
            left-1/2
            -translate-x-1/2
            top-full
            mt-3

            w-64

            bg-slate-950
            border
            border-slate-700

            rounded-xl
            p-3

            text-xs
            text-slate-300

            opacity-0
            invisible

            group-hover:opacity-100
            group-hover:visible

            transition-all
            duration-200

            z-50
            "
                                            >

                                                <div
                                                    className="
                absolute
                -top-1
                left-1/2
                -translate-x-1/2
                w-2
                h-2
                bg-slate-950
                border-l
                border-t
                border-slate-700
                rotate-45
                "
                                                />

                                                <p className="font-medium text-white mb-1">
                                                    {BADGES[badge]?.label}
                                                </p>

                                                <p>
                                                    {BADGES[badge]?.description}
                                                </p>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                        <p
                            className="
  text-slate-300
  mt-4
  max-w-[650px]
  break-words
  line-clamp-3
  "
                        >
                            {user?.bio || "No bio added yet."}
                        </p>
                        <div
                            className="
  flex
  flex-wrap
  gap-2
  mt-4
  "
                        >

                            {

                                isOwner ? (

                                    <div className="flex gap-6">

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

                                            {

                                                hasSocials

                                                    ? "Manage Links"

                                                    : "Link Profiles"

                                            }

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

                                ) : (

                                    <button

                                        onClick={onMessage}

                                        disabled={messageButton.disabled}

                                        className={`
                px-6
                py-2.5

                rounded-xl

                font-medium

                transition-all
                duration-300

                ${messageButton.disabled

                                                ?

                                                "bg-slate-800 text-slate-400 cursor-not-allowed"

                                                :

                                                "bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 text-white"

                                            }

            `}
                                    >

                                        {

                                            messageButton.text

                                        }

                                    </button>

                                )

                            }
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


                        <div
                            className="
  grid
  grid-cols-3
  gap-4
  mt-6
  max-w-xl
  "
                        >


                            <div
                                className="
  bg-slate-900/80
  border
  border-blue-500/10
  rounded-2xl
  p-5
  hover:-translate-y-1
  hover:border-blue-500/40
  transition-all
  duration-300
  "
                            >

                                <div className="flex items-center gap-4">

                                    <div
                                        className="
            w-12
            h-12
            rounded-full
            bg-blue-500/15
            flex
            items-center
            justify-center
            "
                                    >
                                        <FaFolder className="text-blue-400 text-lg" />
                                    </div>

                                    <div>
                                        <h3 className="text-4xl font-bold text-white">
                                            {stats.projects}
                                        </h3>

                                        <p className="text-slate-400 text-sm">
                                            Projects
                                        </p>
                                    </div>

                                </div>
                            </div>

                            <div
                                className="
  bg-slate-900/80
  border
  border-blue-500/10
  rounded-2xl
  p-5
  hover:-translate-y-1
  hover:border-pink-500/40
  transition-all
  duration-300
  "
                            >
                                <div className="flex items-center gap-4">

                                    <div
                                        className="
            w-12
            h-12
            rounded-full
            bg-pink-500/15
            flex
            items-center
            justify-center
            "
                                    >
                                        <FaHeart className="text-pink-400 text-lg" />
                                    </div>

                                    <div>
                                        <h3 className="text-4xl font-bold text-white">
                                            {stats.likes}
                                        </h3>

                                        <p className="text-slate-400 text-sm">
                                            Likes
                                        </p>
                                    </div>

                                </div>
                            </div>

                            <div
                                className="
  bg-slate-900/80
  border
  border-blue-500/10
  rounded-2xl
  p-5
  hover:-translate-y-1
  hover:border-green-500/40
  transition-all
  duration-300
  "
                            >
                                <div className="flex items-center gap-4">

                                    <div
                                        className="
            w-12
            h-12
            rounded-full
            bg-green-500/15
            flex
            items-center
            justify-center
            "
                                    >
                                        <FaBookmark className="text-green-400 text-lg" />
                                    </div>

                                    <div>
                                        <h3 className="text-4xl font-bold text-white">
                                            {stats.bookmarks}
                                        </h3>

                                        <p className="text-slate-400 text-sm">
                                            Bookmarks
                                        </p>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>

                </div>


                <div className="flex flex-col items-end gap-5 mt-6">

                    {/* Buttons Row */}
                    <div className="flex gap-6">


                    </div>

                    {/* Skills Card */}
                    {user?.skills?.length > 0 && (
                        <div
                            className="
            w-[300px]
            bg-slate-900/50
            border
            border-blue-500/10
            rounded-2xl
            p-4
            mt-4
            "
                        >
                            <h3
                                className="
                text-white
                font-semibold
                mb-3
                "
                            >
                                Top Skills
                            </h3>

                            <div className="flex flex-wrap gap-3">

                                {user.skills
                                    .slice(0, 3)
                                    .map((skill) => (
                                        <span
                                            key={skill}
                                            className="
                            px-3
                            py-1
                            rounded-full
                            bg-blue-500/10
                            text-blue-400
                            border
                            border-blue-500/20
                            text-sm
                            hover:bg-blue-500/20
                            transition
                            "
                                        >
                                            {skill}
                                        </span>
                                    ))}

                            </div>

                        </div>
                    )}
                    <div
                        className="
    w-[300px]
    bg-slate-900/50
    border
    border-blue-500/10
    rounded-2xl
    p-4
    "
                    >
                        {
                            isOwner && (
                                <>
                                    <div className="flex justify-between items-center mb-3">

                                        <h3
                                            className="
                    text-white
                    font-semibold
                    "
                                        >
                                            Profile Completion
                                        </h3>

                                        <span
                                            className="
                    text-blue-400
                    font-bold
                    "
                                        >
                                            {user.profileCompletion}%
                                        </span>

                                    </div>

                                    <div
                                        className="
                h-2
                bg-slate-800
                rounded-full
                overflow-hidden
                mb-4
                "
                                    >
                                        <div
                                            className="
                    h-full
                    bg-gradient-to-r
                    from-blue-500
                    to-cyan-400
                    rounded-full
                    "
                                            style={{
                                                width: `${user.profileCompletion}%`
                                            }}
                                        />
                                    </div>

                                    {user.profileCompletion === 100 && (
                                        <div
                                            className="
                    flex
                    items-center
                    gap-2
                    mt-3
                    text-green-400
                    text-sm
                    font-medium
                    "
                                        >
                                            <FaCheckCircle />
                                            Profile Fully Verified
                                        </div>
                                    )}
                                </>
                            )
                        }


                        <div
                            className="
        flex
        justify-between
        items-center
        "
                        >
                            <div>

                                <p className="text-slate-400 text-xs">
                                    Member Since
                                </p>

                                <p className="text-white font-medium">
                                    {memberSince}
                                </p>

                            </div>

                            <span
                                className="
            px-3
            py-1
            rounded-full
            bg-green-500/10
            text-green-400
            text-xs
            "
                            >
                                Active
                            </span>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default ProfileHeader;