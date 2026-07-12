import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchDropdown = ({
    query,
    users,
    projects,
    loading,
    onClose,
}) => {

    const navigate = useNavigate();

    if (loading) {

        return (

            <div
                className="
                absolute
                top-14
                left-0
                w-full
                rounded-2xl
                border
                border-slate-800
                bg-slate-950
                p-6
                shadow-xl
                z-50
                "
            >

                <div className="space-y-3">

                    {
                        [...Array(5)].map((_, index) => (

                            <div
                                key={index}
                                className="
                                h-12
                                rounded-xl
                                bg-slate-800
                                animate-pulse
                                "
                            />

                        ))
                    }

                </div>

            </div>

        );

    }

    return (

        <div
            className="
            absolute
            top-14
            left-0
            w-full
            rounded-2xl
            border
            border-slate-800
            bg-slate-950
            shadow-xl
            overflow-hidden
            z-50
            "
        >

            {

                users.length === 0 &&
                projects.length === 0 && (

                    <div
                        className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        gap-3
                        py-10
                        "
                    >

                        <Search
                            size={28}
                            className="text-slate-500"
                        />

                        <p className="text-slate-400">

                            No results found

                        </p>

                    </div>

                )

            }

            {

                users.length > 0 && (

                    <div>

                        <div
                            className="
                            px-5
                            py-3
                            text-xs
                            uppercase
                            tracking-wider
                            text-slate-500
                            border-b
                            border-slate-800
                            "
                        >

                            Users

                        </div>

                        {

                            users.map(user => (

                                <button

                                    key={user._id}

                                    onClick={() => {

                                        navigate(

                                            `/profile/${user.username}`

                                        );

                                        onClose();

                                    }}

                                    className="
                                    w-full
                                    flex
                                    items-center
                                    gap-3
                                    px-5
                                    py-3
                                    hover:bg-slate-900
                                    transition
                                    "

                                >

                                    <img

                                        src={user.avatar}

                                        alt={user.fullName}

                                        className="
                                        h-10
                                        w-10
                                        rounded-full
                                        object-cover
                                        "

                                    />

                                    <div
                                        className="
                                        flex-1
                                        text-left
                                        "
                                    >

                                        <p
                                            className="
                                            text-white
                                            font-medium
                                            "
                                        >

                                            {user.fullName}

                                        </p>

                                        <p
                                            className="
                                            text-sm
                                            text-slate-400
                                            "
                                        >

                                            @{user.username}

                                        </p>

                                    </div>

                                </button>

                            ))

                        }

                    </div>

                )

            }

            {

                projects.length > 0 && (

                    <div>

                        <div
                            className="
                            px-5
                            py-3
                            text-xs
                            uppercase
                            tracking-wider
                            text-slate-500
                            border-y
                            border-slate-800
                            "
                        >

                            Projects

                        </div>

                        {

                            projects.map(project => (

                                <button

                                    key={project._id}

                                    onClick={() => {

                                        navigate(

                                            `/projects/${project._id}`

                                        );

                                        onClose();

                                    }}

                                    className="
                                    w-full
                                    flex
                                    items-center
                                    gap-3
                                    px-5
                                    py-3
                                    hover:bg-slate-900
                                    transition
                                    "

                                >

                                    <img

                                        src={
                                            project.thumbnail?.url ||

                                            "https://placehold.co/60x60"
                                        }

                                        alt={project.title}

                                        className="
                                        h-10
                                        w-10
                                        rounded-lg
                                        object-cover
                                        "

                                    />

                                    <div
                                        className="
                                        flex-1
                                        text-left
                                        "
                                    >

                                        <p
                                            className="
                                            text-white
                                            font-medium
                                            "
                                        >

                                            {project.title}

                                        </p>

                                        <p
                                            className="
                                            text-sm
                                            text-slate-400
                                            truncate
                                            "
                                        >

                                            {project.owner?.fullName}

                                        </p>

                                    </div>

                                </button>

                            ))

                        }

                    </div>

                )

            }

            {

                (users.length > 0 ||

                    projects.length > 0) && (

                    <button

                        onClick={() => {

                            navigate(
                                `/search?q=${encodeURIComponent(
                                    query
                                )}`
                            );

                            onClose();

                        }}

                        className="
                        w-full
                        py-3
                        border-t
                        border-slate-800
                        text-blue-400
                        hover:bg-slate-900
                        transition
                        "

                    >

                        View all results

                    </button>

                )

            }

        </div>

    );

};

export default SearchDropdown;