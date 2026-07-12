import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ProjectCard from "../../components/cards/ProjectCard";
import UserCard from "../../components/cards/UserCard";

import {
    search,
    setQuery,
    setType,
} from "../../features/search/searchSlice";

function SearchPage() {

    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();

    const query = searchParams.get("q") || "";

    const {
        users,
        projects,
        loading,
        type,
        pagination,
    } = useSelector(
        state => state.search
    );

    const hasResults = users.length > 0 || projects.length > 0;

    useEffect(() => {

        if (!query.trim()) return;



        dispatch(
            search({
                query,
                type,
                page: 1,
                limit: 20,
            })
        );

    }, [dispatch, query, type]);

    return (

        <div
            className="
    h-[calc(100vh-64px)]
    overflow-y-auto
    scrollbar-thin
    scrollbar-thumb-slate-700
    scrollbar-track-transparent
    "
        >

            <div className="max-w-7xl mx-auto px-6 py-8">

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-white">

                        Search Results

                    </h1>

                    <p className="text-slate-400 mt-2">

                        Results for

                        <span className="text-blue-400 ml-2">

                            "{query}"

                        </span>

                    </p>

                </div>

                <div className="flex items-center justify-between mb-8">

                    <div className="flex gap-3">

                        {

                            ["all", "users", "projects"].map(tab => (

                                <button

                                    key={tab}

                                    onClick={() =>
                                        dispatch(
                                            setType(tab)
                                        )
                                    }

                                    className={`
                        px-5
                        py-2
                        rounded-xl
                        transition

                        ${type === tab

                                            ?

                                            "bg-blue-600 text-white"

                                            :

                                            "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800"
                                        }
                    `}

                                >

                                    {

                                        tab.charAt(0).toUpperCase()

                                        +

                                        tab.slice(1)

                                    }

                                </button>

                            ))

                        }

                    </div>

                    {

                        loading && hasResults && (

                            <div
                                className="
                flex
                items-center
                gap-2
                text-sm
                text-slate-400
                "
                            >

                                <Loader2
                                    size={16}
                                    className="
                    animate-spin
                    text-blue-400
                    "
                                />



                            </div>

                        )

                    }

                </div>

                {

                    !loading &&

                    users.length === 0 &&

                    projects.length === 0 && (

                        <div className="text-center py-24">

                            <h2 className="text-2xl text-white">

                                No Results Found

                            </h2>

                            <p className="text-slate-500 mt-3">

                                Try searching with another keyword.

                            </p>

                        </div>

                    )

                }

                {

                    (type === "all" || type === "users")

                    &&

                    users.length > 0 && (

                        <section className="mb-12">

                            <div className="flex justify-between items-center mb-6">

                                <h2 className="text-2xl font-semibold text-white">

                                    Developers

                                </h2>

                                <span className="text-slate-400">

                                    {

                                        pagination?.usersCount ||

                                        users.length

                                    }

                                    {" "}results

                                </span>

                            </div>

                            <div
                                className={`
        grid
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
        transition-all
        duration-300

        ${loading
                                        ? "opacity-60"
                                        : "opacity-100"
                                    }
    `}
                            >

                                {

                                    users.map(user => (

                                        <UserCard

                                            key={user._id}

                                            user={user}

                                        />

                                    ))

                                }

                            </div>

                        </section>

                    )

                }

                {

                    (type === "all" || type === "projects")

                    &&

                    projects.length > 0 && (

                        <section>

                            <div className="flex justify-between items-center mb-6">

                                <h2 className="text-2xl font-semibold text-white">

                                    Projects

                                </h2>

                                <span className="text-slate-400">

                                    {

                                        pagination?.projectsCount ||

                                        projects.length

                                    }

                                    {" "}results

                                </span>

                            </div>

                            <div
                                className={`
        grid
        lg:grid-cols-2
        xl:grid-cols-3
        gap-6
        transition-all
        duration-300

        ${loading
                                        ? "opacity-60"
                                        : "opacity-100"
                                    }
    `}
                            >

                                {

                                    projects.map(project => (

                                        <ProjectCard

                                            key={project._id}

                                            project={project}

                                        />

                                    ))

                                }

                            </div>

                        </section>

                    )

                }

            </div>
        </div>

    );

}

export default SearchPage;