import { FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function UserCard({ user }) {

    const navigate = useNavigate();

    return (

        <div
            className="
            bg-slate-900/50
            backdrop-blur-xl
            border
            border-blue-500/10
            rounded-xl
            p-6
            hover:-translate-y-1
            hover:shadow-[0_0_25px_rgba(37,99,235,0.15)]
            transition-all
            duration-300
            "
        >

            <div className="flex flex-col items-center">

                <img
                    src={
                        user?.avatar ||
                        "https://i.pravatar.cc/150"
                    }
                    alt={user?.fullName}
                    className="
                    w-24
                    h-24
                    rounded-full
                    object-cover
                    border
                    border-blue-500/20
                    "
                />

                <div className="flex items-center gap-2 mt-4">

                    <h2 className="text-white text-lg font-semibold">

                        {user?.fullName}

                    </h2>

                    {

                        user?.isVerified && (

                            <FaCheckCircle
                                className="text-blue-400"
                            />

                        )

                    }

                </div>

                <p className="text-slate-400">

                    @{user?.username}

                </p>

                {

                    user?.location && (

                        <div
                            className="
                            flex
                            items-center
                            gap-2
                            mt-2
                            text-slate-500
                            text-sm
                            "
                        >

                            <FaMapMarkerAlt />

                            {user.location}

                        </div>

                    )

                }

                {

                    user?.bio && (

                        <p
                            className="
                            text-slate-400
                            text-sm
                            mt-4
                            text-center
                            line-clamp-2
                            "
                        >

                            {user.bio}

                        </p>

                    )

                }

            </div>

            {

                user?.skills?.length > 0 && (

                    <div
                        className="
                        flex
                        flex-wrap
                        gap-2
                        justify-center
                        mt-5
                        "
                    >

                        {

                            user.skills

                                .slice(0, 4)

                                .map(skill => (

                                    <span
                                        key={skill}
                                        className="
                                        px-3
                                        py-1
                                        rounded-full
                                        bg-blue-500/10
                                        text-blue-300
                                        text-xs
                                        "
                                    >

                                        {skill}

                                    </span>

                                ))

                        }

                    </div>

                )

            }

            <button

                onClick={() =>

                    navigate(

                        `/profile/${user.username}`

                    )

                }

                className="
                w-full
                mt-6
                bg-blue-600
                hover:bg-blue-700
                rounded-lg
                py-2
                transition
                "

            >

                View Profile

            </button>

        </div>

    );

}

export default UserCard;