import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    Users,
    FolderGit2,
    UserCheck,
    Briefcase,
    Search,
    ArrowUpDown
} from "lucide-react";
import { FiPlus } from "react-icons/fi";

import TeamCard from "../../components/cards/TeamCard";
import TeamTabs from "../../components/navigation/TeamTabs";
import EmptyTeams from "../../components/ui/EmptyTeams";
import TeamSkeleton from "../../components/ui/TeamSkeleton";

import { getMyTeams } from "../../services/teamService";

import {
    setLoading,
    setError,
    clearError,
    setTeams,
} from "../../features/teams/teamSlice";

function Teams() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("my");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("latest");

    const {
        teams,
        loading,
        error,
    } = useSelector(
        (state) => state.teams
    );

    const { user } = useSelector(
        (state) => state.auth
    );

    const fetchTeams = async () => {

        try {

            dispatch(setLoading(true));

            dispatch(clearError());

            const response =
                await getMyTeams();

            dispatch(
                setTeams(
                    response.data.data
                )
            );

        } catch (error) {

            dispatch(
                setError(
                    error?.response?.data?.message ||
                    "Failed to fetch teams."
                )
            );

        } finally {

            dispatch(
                setLoading(false)
            );

        }

    };

    useEffect(() => {

        fetchTeams();

    }, []);

    const myTeams = useMemo(() => {

        return teams.filter(
            (team) =>
                team.owner._id === user._id
        );

    }, [teams, user]);

    const joinedTeams = useMemo(() => {

        return teams.filter(
            (team) =>
                team.owner._id !== user._id
        );

    }, [teams, user]);

    const filteredTeams = useMemo(() => {

        const source =
            activeTab === "joined"
                ? joinedTeams
                : myTeams;

        const filtered = source.filter(team =>
            team.name
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            team.description
                ?.toLowerCase()
                .includes(search.toLowerCase())
        );

        switch (sortBy) {

            case "members":

                filtered.sort(
                    (a, b) =>

                        (b.memberCount || b.members?.length || 0)

                        -

                        (a.memberCount || a.members?.length || 0)
                );

                break;

            case "name":

                filtered.sort(
                    (a, b) =>

                        a.name.localeCompare(b.name)
                );

                break;

            case "oldest":

                filtered.sort(
                    (a, b) =>

                        new Date(a.createdAt)

                        -

                        new Date(b.createdAt)
                );

                break;

            default:

                filtered.sort(
                    (a, b) =>

                        new Date(b.createdAt)

                        -

                        new Date(a.createdAt)
                );

        }

        return filtered;

    }, [
        search,
        activeTab,
        sortBy,
        myTeams,
        joinedTeams,
    ]);
    const totalMembers = useMemo(() => {

        return myTeams.reduce(
            (total, team) =>
                total + (team.members?.length || 0),
            0
        );

    }, [myTeams]);

    const totalProjects = useMemo(() => {

        return myTeams.filter(
            team => team.project
        ).length;

    }, [myTeams]);

    const renderContent = () => {

        if (loading) {

            return (

                <div
                    className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-6
                    "
                >

                    {[...Array(6)].map((_, index) => (

                        <TeamSkeleton
                            key={index}
                        />

                    ))}

                </div>

            );

        }

        if (error) {

            return (

                <div
                    className="
                    flex
                    justify-center
                    items-center

                    py-24
                    "
                >

                    <h2
                        className="
                        text-red-400
                        text-xl
                        "
                    >

                        {error}

                    </h2>

                </div>

            );

        }

        if (
            filteredTeams.length === 0
        ) {

            return (

                <EmptyTeams

                    title={
                        activeTab === "joined"
                            ? "No Joined Teams"
                            : "No Teams Yet"
                    }

                    description={
                        activeTab === "joined"
                            ? "Join a recruitment to become part of a team."
                            : "Create your first team and start collaborating."
                    }

                    buttonText="Create Team"

                    onClick={() =>
                        navigate("/teams/create")
                    }

                />

            );

        }

        return (

            <div
                className="
    grid
    grid-cols-1
    lg:grid-cols-2
    2xl:grid-cols-3

    gap-7

    items-start
    "
            >

                {filteredTeams.map(
                    (team) => (

                        <TeamCard

                            key={team._id}

                            team={team}

                        />

                    )
                )}

            </div>

        );

    };
    return (

        <div className="space-y-8">

            {/* Header */}

            <div
                className="
                flex
                flex-col
                lg:flex-row
                lg:items-center
                lg:justify-between
                gap-6
                "
            >

                <div className="flex items-center gap-5">

                    <div
                        className="
        w-16
        h-16

        rounded-2xl

        bg-gradient-to-br
        from-blue-600
        via-cyan-500
        to-blue-500

        flex
        items-center
        justify-center

        shadow-[0_0_35px_rgba(59,130,246,0.45)]
        "
                    >

                        <Users
                            size={30}
                            className="text-white"
                        />

                    </div>

                    <div>

                        <h1
                            className="
            text-5xl
            font-bold
            text-white
            "
                        >
                            Teams
                        </h1>

                        <p
                            className="
            text-slate-400
            mt-2
            "
                        >
                            Manage your teams, collaborate with members and track project progress.
                        </p>

                    </div>

                </div>

                <button

                    onClick={() =>
                        navigate("/teams/create")
                    }

                    className="
                    flex
                    items-center
                    gap-2

                    px-5
                    py-3

                    rounded-xl

                    bg-blue-600
                    hover:bg-blue-500

                    text-white

                    transition
                    "
                >

                    <FiPlus size={18} />

                    Create Team

                </button>

            </div>

            {/* Stats */}

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">

                {[
                    {
                        title: "My Teams",
                        value: myTeams.length,
                        subtitle: "Owned Teams",
                        color: "text-blue-400",
                        bg: "from-blue-500/20 to-cyan-500/10",
                        icon: Users
                    },
                    {
                        title: "Joined",
                        value: joinedTeams.length,
                        subtitle: "Collaborating",
                        color: "text-green-400",
                        bg: "from-green-500/20 to-emerald-500/10",
                        icon: UserCheck
                    },
                    {
                        title: "Members",
                        value: totalMembers,
                        subtitle: "Across Teams",
                        color: "text-yellow-400",
                        bg: "from-yellow-500/20 to-orange-500/10",
                        icon: Users
                    },
                    {
                        title: "Projects",
                        value: totalProjects,
                        subtitle: "Active",
                        color: "text-purple-400",
                        bg: "from-purple-500/20 to-pink-500/10",
                        icon: FolderGit2
                    }
                ].map((card) => {

                    const Icon = card.icon;

                    return (

                        <div
                            key={card.title}
                            className="
                group

                rounded-3xl

                border
                border-blue-500/10

                bg-slate-900/50

                p-6

                hover:-translate-y-1
                hover:border-blue-500/30

                transition-all
                duration-300
                "
                        >

                            <div className="flex justify-between">

                                <div>

                                    <p className="text-slate-400 text-sm">

                                        {card.title}

                                    </p>

                                    <h2
                                        className={`
                            mt-3
                            text-4xl
                            font-bold
                            ${card.color}
                            `}
                                    >

                                        {card.value}

                                    </h2>

                                    <p
                                        className="
                            mt-2
                            text-xs
                            text-slate-500
                            "
                                    >

                                        {card.subtitle}

                                    </p>

                                </div>

                                <div
                                    className={`
                        w-14
                        h-14

                        rounded-2xl

                        bg-gradient-to-br
                        ${card.bg}

                        flex
                        items-center
                        justify-center
                        `}
                                >

                                    <Icon
                                        size={24}
                                        className={card.color}
                                    />

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

            {/* Tabs */}

            <TeamTabs

                activeTab={activeTab}

                setActiveTab={setActiveTab}

            />

            {/* Search */}

            {activeTab !== "create" && (

                <div
                    className="
    flex
    flex-col
    lg:flex-row
    gap-4
    "
                >

                    <div
                        className="
        relative
        flex-1
        "
                    >

                        <Search
                            size={18}
                            className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-500
            "
                        />

                        <input

                            type="text"

                            value={search}

                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }

                            placeholder="Search your teams..."

                            className="
            w-full

            pl-12
            pr-4
            py-3

            rounded-2xl

            bg-slate-900/50

            border
            border-blue-500/10

            text-white

            placeholder:text-slate-500

            outline-none

            focus:border-blue-500/40
            transition
            "
                        />

                    </div>

                    <div
                        className="
        flex
        items-center
        gap-3
        "
                    >

                        <ArrowUpDown
                            size={18}
                            className="
            text-slate-400
            "
                        />

                        <select

                            value={sortBy}

                            onChange={(e) =>
                                setSortBy(
                                    e.target.value
                                )
                            }

                            className="
            bg-slate-900/50

            border
            border-blue-500/10

            rounded-xl

            px-4
            py-3

            text-white

            outline-none

            cursor-pointer
            "
                        >

                            <option value="latest">
                                Latest
                            </option>

                            <option value="oldest">
                                Oldest
                            </option>

                            <option value="members">
                                Members
                            </option>

                            <option value="name">
                                Name
                            </option>

                        </select>

                    </div>

                </div>

            )}
            {/* Create */}

            {activeTab === "create" ? (

                <div
                    className="
                    flex
                    justify-center
                    py-20
                    "
                >

                    <button

                        onClick={() =>
                            navigate("/teams/create")
                        }

                        className="
                        flex
                        items-center
                        gap-3

                        px-6
                        py-4

                        rounded-xl

                        bg-blue-600
                        hover:bg-blue-500

                        text-white
                        "
                    >

                        <FiPlus />

                        Create New Team

                    </button>

                </div>

            ) : (

                renderContent()

            )}

        </div>

    );

}

export default Teams;