import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskColumn from "../../components/ui/TaskColumn";
import CreateTaskModal from "../../components/modals/CreateTaskModal";
import TaskBoard from "../../components/ui/TaskBoard";
import TaskDetailsModal from "../../components/modals/TaskDetailsModal";
import ResourcesTab from "./ResourcesTab";
import InviteMemberModal from "../../components/modals/InviteMemberModal";
import TeamOwnerMenu from "../../components/cards/TeamOwnerMenu";

import {
    Users,
    FolderGit2,
    Settings,
    ClipboardList,
    Megaphone,
    Crown,
    CalendarDays,
    ShieldCheck,
    FolderOpen
} from "lucide-react";

import {
    getTeamById,
    createAnnouncement,
    getAnnouncements,
    updateAnnouncement,
    deleteAnnouncement,
    togglePinAnnouncement,
    getPendingInvitations,
    cancelInvitation,
    deleteTeam
} from "../../services/teamService";

import { getTeamTasks } from "../../services/taskService";

function TeamDetails() {
    const navigate = useNavigate()

    const { teamId } = useParams();

    const [loading, setLoading] = useState(true);

    const [team, setTeam] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    const [showTaskDetails, setShowTaskDetails] = useState(false);

    const [tasks, setTasks] = useState({

        todo: [],

        inProgress: [],

        done: []

    });

    const [activeTab, setActiveTab] = useState("overview");
    const [showCreateTask, setShowCreateTask] = useState(false);

    const [announcements, setAnnouncements] = useState([]);
    const [announcementTitle, setAnnouncementTitle] = useState("");
    const [announcementContent, setAnnouncementContent] = useState("");
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [announcementLoading, setAnnouncementLoading] = useState(false);

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [pendingInvitations, setPendingInvitations] = useState([]);

    const fetchTeam = async () => {

        try {

            const [teamRes, taskRes] = await Promise.all([
                getTeamById(teamId),

                getTeamTasks(teamId)

            ]);


            setTeam(teamRes.data.data);

            setTasks(taskRes.data.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };
    const fetchAnnouncements = async () => {

        try {

            const res = await getAnnouncements(teamId);

            setAnnouncements(res.data.data);

        }

        catch (err) {

            console.log(err);

        }

    };
    const fetchPendingInvitations = async () => {

        if (!team?.isOwner) return;

        try {

            const res =
                await getPendingInvitations(teamId);

            setPendingInvitations(
                res.data.data
            );

        }

        catch (err) {

            console.log(err);

        }

    };
    const handleCancelInvitation = async (invitationId) => {

        try {

            await cancelInvitation(invitationId);

            fetchPendingInvitations();

        }

        catch (err) {

            console.log(err);

        }

    };
    const handleEdit = () => {

        navigate(`/teams/${teamId}/edit`);

    };

    const handleDelete = async () => {

        const confirmed = window.confirm(

            "Are you sure you want to delete this team?"

        );

        if (!confirmed) return;

        try {

            await deleteTeam(teamId);

            navigate("/teams");

        }

        catch (err) {

            console.log(err);

            alert(

                err.response?.data?.message ||

                "Unable to delete team."

            );

        }

    };
    const handleCreateAnnouncement = async () => {

        if (
            !announcementTitle.trim() ||
            !announcementContent.trim()
        ) {
            return;
        }

        try {

            setAnnouncementLoading(true);

            await createAnnouncement(
                teamId,
                announcementTitle,
                announcementContent
            );

            setAnnouncementTitle("");
            setAnnouncementContent("");

            await fetchAnnouncements();

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setAnnouncementLoading(false);

        }

    };
    const handleUpdateAnnouncement = async () => {

        if (!editingAnnouncement) return;

        if (
            !announcementTitle.trim() ||
            !announcementContent.trim()
        ) {
            return;
        }

        try {

            setAnnouncementLoading(true);

            await updateAnnouncement(

                teamId,

                editingAnnouncement._id,

                announcementTitle,

                announcementContent

            );

            setEditingAnnouncement(null);

            setAnnouncementTitle("");

            setAnnouncementContent("");

            await fetchAnnouncements();

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setAnnouncementLoading(false);

        }

    };
    const handleDeleteAnnouncement = async (announcementId) => {

        try {

            await deleteAnnouncement(

                teamId,

                announcementId

            );

            await fetchAnnouncements();

        }

        catch (err) {

            console.log(err);

        }

    };
    const handleTogglePin = async (
        announcementId
    ) => {

        try {

            await togglePinAnnouncement(
                teamId,
                announcementId
            );

            await fetchAnnouncements();

        }

        catch (err) {

            console.log(err);

        }

    };


    useEffect(() => {

        fetchTeam();
        fetchAnnouncements()

    }, [teamId]);

    useEffect(() => {

        if (team?.isOwner) {

            fetchPendingInvitations();

        }

    }, [team]);


    if (loading) {

        return (

            <div className="h-[75vh] flex items-center justify-center">

                <div
                    className="
                    w-12
                    h-12

                    rounded-full

                    border-4
                    border-blue-500/20
                    border-t-blue-500

                    animate-spin
                    "
                />

            </div>

        );

    }

    if (!team) {

        return (

            <div
                className="
                h-[70vh]

                flex

                items-center
                justify-center

                text-red-400
                text-xl
                "
            >

                Team not found

            </div>

        );

    }

    return (

        <div className="max-w-7xl mx-auto space-y-8">

            {/* Banner */}

            <div
                className="
    relative

    h-72

    rounded-3xl
    z-50

    overflow-visible

    bg-gradient-to-r

    from-[#132347]
    via-[#101c35]
    to-[#163d68]

    border
    border-blue-500/10
    "
            >

                {/* Decorative Glow */}

                <div
                    className="
        absolute

        -top-20
        -right-20

        h-72
        w-72

        rounded-full

        bg-cyan-500/20

        blur-[120px]
        "
                />

                <div
                    className="
        absolute

        bottom-0
        left-0
        right-0

        h-28

        bg-gradient-to-t
        from-slate-950
        to-transparent
        "
                />

                {/* Team Info */}

                <div
                    className="
        absolute

        bottom-10
        left-10
        right-10

        flex
        justify-between
        items-end
        "
                >

                    <div className="flex items-end gap-6">

                        {/* Avatar */}

                        <div
                            className="
                h-24
                w-24

                rounded-3xl

                bg-gradient-to-br
                from-blue-500
                to-cyan-500

                border-4
                border-slate-900

                flex
                items-center
                justify-center

                text-5xl
                font-bold
                text-white

                shadow-xl
                "
                        >

                            {team.name.charAt(0)}

                        </div>

                        <div>

                            <h1
                                className="
                    text-4xl
                    font-bold
                    text-white
                    "
                            >
                                {team.name}
                            </h1>

                            <div
                                className="
                    flex
                    flex-wrap
                    gap-3

                    mt-4
                    "
                            >

                                <span
                                    className="
                        px-4
                        py-2

                        rounded-full

                        bg-blue-500/20

                        text-blue-300

                        border
                        border-blue-400/20

                        text-sm
                        "
                                >
                                    📁 {team.project.title}
                                </span>

                                <span
                                    className="
                        px-4
                        py-2

                        rounded-full

                        bg-green-500/20

                        text-green-300

                        border
                        border-green-400/20

                        text-sm
                        "
                                >
                                    👥 {team.memberCount} Members
                                </span>

                                <span
                                    className="
                        px-4
                        py-2

                        rounded-full

                        bg-yellow-500/20

                        text-yellow-300

                        border
                        border-yellow-400/20

                        text-sm
                        "
                                >
                                    🛡 {team.currentUserRole}
                                </span>

                            </div>

                        </div>

                    </div>

                    {team.isOwner && (

                        <TeamOwnerMenu

                            onEdit={handleEdit}

                            onDelete={handleDelete}

                        />

                    )}
                </div>

            </div>




            {/* Tabs */}

            <div
                className="
                flex
                gap-4
                flex-wrap

                border-b
                border-blue-500/10

                pb-5
                "
            >

                {[
                    {
                        id: "overview",
                        icon: FolderGit2
                    },
                    {
                        id: "tasks",
                        icon: ClipboardList
                    },
                    {
                        id: "members",
                        icon: Users
                    },
                    {
                        id: "resources",
                        icon: FolderOpen
                    },

                    {
                        id: "announcements",
                        icon: Megaphone
                    },
                    

                ].map((tab) => {

                    const Icon = tab.icon;

                    return (

                        <button

                            key={tab.id}

                            onClick={() => setActiveTab(tab.id)
                            }

                            className={`
                            flex
                            items-center
                            gap-2

                            px-5
                            py-3

                            rounded-xl

                            capitalize

                            transition-all

                            ${activeTab === tab.id

                                    ?

                                    "bg-blue-600 text-white"

                                    :

                                    "text-slate-400 hover:bg-slate-800"
                                }
                            `}
                        >

                            <Icon size={18} />

                            {tab.id}

                        </button>

                    );

                })}

            </div>


            {/* Workspace Stats */}

            <div
                className="
    grid
    grid-cols-2
    lg:grid-cols-4
    gap-5
    "
            >

                <div
                    className="
        rounded-2xl

        bg-slate-900/50

        border
        border-blue-500/10

        p-6
        "
                >

                    <p className="text-slate-400 text-sm">

                        Todo

                    </p>

                    <h2 className="text-4xl font-bold text-white mt-2">

                        {tasks.todo.length}

                    </h2>

                </div>

                <div
                    className="
        rounded-2xl

        bg-slate-900/50

        border
        border-yellow-500/10

        p-6
        "
                >

                    <p className="text-slate-400 text-sm">

                        In Progress

                    </p>

                    <h2 className="text-4xl font-bold text-yellow-400 mt-2">

                        {tasks.inProgress.length}

                    </h2>

                </div>

                <div
                    className="
        rounded-2xl

        bg-slate-900/50

        border
        border-green-500/10

        p-6
        "
                >

                    <p className="text-slate-400 text-sm">

                        Completed

                    </p>

                    <h2 className="text-4xl font-bold text-green-400 mt-2">

                        {tasks.done.length}

                    </h2>

                </div>

                <div
                    className="
        rounded-2xl

        bg-slate-900/50

        border
        border-cyan-500/10

        p-6
        "
                >

                    <p className="text-slate-400 text-sm">

                        Progress

                    </p>

                    <h2 className="text-4xl font-bold text-cyan-400 mt-2">

                        {Math.round(
                            ((tasks.done.length) /

                                Math.max(

                                    tasks.todo.length +
                                    tasks.inProgress.length +
                                    tasks.done.length,

                                    1

                                )) * 100
                        )}%

                    </h2>

                </div>

            </div>


            {/* Content */}

            <div
                className="
                rounded-3xl

                bg-slate-900/50

                border
                border-blue-500/10

                p-8
                "
            >
                {/* Overview */}

                {activeTab === "overview" && (

                    <div className="grid lg:grid-cols-3 gap-8">

                        <div className="lg:col-span-2">

                            <h2 className="text-2xl font-semibold text-white">
                                About Team
                            </h2>

                            <p className="mt-5 text-slate-400 leading-8">
                                {team.description}
                            </p>

                            <div className="mt-10">

                                <h3 className="text-xl font-semibold text-white">
                                    Project
                                </h3>

                                <div
                                    className="
                                    mt-5

                                    rounded-2xl

                                    border
                                    border-blue-500/10

                                    bg-slate-800/40

                                    p-6
                                    "
                                >

                                    <h4 className="text-white text-lg font-semibold">
                                        {team.project.title}
                                    </h4>

                                    <p className="text-slate-400 mt-2">
                                        {team.project.category}
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div>

                            <div
                                className="
                                rounded-2xl

                                bg-slate-800/40

                                border
                                border-blue-500/10

                                p-6
                                "
                            >

                                <h3 className="text-white font-semibold">
                                    Team Lead
                                </h3>

                                <div className="flex items-center gap-4 mt-6">

                                    <img
                                        src={team.owner.avatar}
                                        alt={team.owner.username}
                                        onClick={() =>
                                            navigate(`/profile/${team.owner.username}`)
                                        }
                                        className="
        w-16
        h-16

        rounded-full

        object-cover

        cursor-pointer

        hover:scale-110

        transition-all
        duration-300

        border-2
        border-transparent

        hover:border-blue-500
    "
                                    />

                                    <div>

                                        <p className="text-white font-medium">
                                            {team.owner.fullName}
                                        </p>

                                        <p className="text-slate-400 text-sm">
                                            @{team.owner.username}
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div
                                className="
                                rounded-2xl

                                bg-slate-800/40

                                border
                                border-blue-500/10

                                p-6

                                mt-6
                                "
                            >

                                <div className="flex items-center justify-between mb-5">

                                    <h3 className="text-white font-semibold">
                                        Team Members
                                    </h3>

                                    <button
                                        onClick={() => setActiveTab("members")}
                                        className="
    flex
    items-center
    gap-2

    px-3
    py-2

    rounded-lg

    bg-blue-500/10

    border
    border-blue-500/20

    text-blue-400

    hover:bg-blue-500/20

    transition-all
    duration-300
    "
                                    >
                                        View All

                                        <span className="text-lg">→</span>
                                    </button>

                                </div>

                                {team.members.slice(0, 5).map(member => (

                                    <div
                                        key={member.user._id}
                                        className="
                                        flex
                                        items-center
                                        justify-between

                                        py-3
                                        "
                                    >

                                        <div className="flex items-center gap-3">

                                            <img
                                                src={member.user.avatar}
                                                alt={member.user.username}
                                                onClick={() =>
                                                    navigate(`/profile/${member.user.username}`)
                                                }
                                                className="
        w-10
        h-10

        rounded-full

        object-cover

        cursor-pointer

        hover:scale-110

        transition-all
        duration-300

        border-2
        border-transparent

        hover:border-blue-500
    "
                                            />

                                            <div>

                                                <p className="text-white text-sm">
                                                    {member.user.fullName}
                                                </p>

                                                <p className="text-slate-500 text-xs">
                                                    @{member.user.username}
                                                </p>

                                            </div>

                                        </div>

                                        <span
                                            className="
                                            text-xs

                                            bg-blue-500/10

                                            text-blue-400

                                            px-3
                                            py-1

                                            rounded-full
                                            "
                                        >

                                            {member.role}

                                        </span>

                                    </div>

                                ))}

                            </div>

                        </div>

                    </div>

                )}

                {/* Tasks */}

                {activeTab === "tasks" && (

                    <TaskBoard
                        tasks={tasks}
                        refreshTasks={fetchTeam}
                        onAddTask={() => setShowCreateTask(true)}
                        onTaskClick={(task) => {
                            setSelectedTask(task);
                            setShowTaskDetails(true);
                        }}
                    />

                )}

                {/* Members */}

                {activeTab === "members" && (

                    <>

                        <div className="flex justify-between items-center mb-8">

                            <h2 className="text-2xl font-semibold text-white">
                                Team Members
                            </h2>

                            {team.isOwner && (

                                <button
                                    onClick={() => setShowInviteModal(true)}
                                    className="
                    px-5
                    py-2
                    rounded-xl
                    bg-blue-600
                    hover:bg-blue-500
                    text-white
                    "
                                >
                                    Invite Member
                                </button>

                            )}

                        </div>

                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                            {team.members.map(member => (

                                <div
                                    key={member.user._id}
                                    className="
                    rounded-2xl
                    border
                    border-blue-500/10
                    bg-slate-800/40
                    p-5
                    "
                                >

                                    <img
                                        src={member.user.avatar}
                                        alt={member.user.username}
                                        onClick={() =>
                                            navigate(`/profile/${member.user.username}`)
                                        }
                                        className="
                        w-16
                        h-16
                        rounded-full
                        object-cover
                        cursor-pointer
                        hover:scale-105
                        transition-all
                        duration-300
                        border-2
                        border-transparent
                        hover:border-blue-500
                        "
                                    />

                                    <h2 className="mt-4 text-white font-semibold">
                                        {member.user.fullName}
                                    </h2>

                                    <p className="text-slate-400 text-sm">
                                        @{member.user.username}
                                    </p>

                                    <span
                                        className="
                        inline-block
                        mt-4
                        px-3
                        py-1
                        rounded-full
                        bg-blue-500/10
                        text-blue-400
                        text-xs
                        "
                                    >
                                        {member.role}
                                    </span>

                                </div>

                            ))}

                            {
                                team.isOwner && pendingInvitations.length > 0 && (

                                    <div className="col-span-full mt-8">

                                        <h2 className="text-xl font-semibold text-white mb-5">

                                            Pending Invitations

                                        </h2>

                                        <div className="space-y-4">

                                            {

                                                pendingInvitations.map(invite => (

                                                    <div

                                                        key={invite._id}

                                                        className="
                            flex
                            items-center
                            justify-between

                            rounded-2xl

                            bg-slate-800/40

                            border
                            border-yellow-500/20

                            p-5
                            "

                                                    >

                                                        <div className="flex items-center gap-4">

                                                            <img

                                                                src={invite.receiver.avatar}

                                                                alt={invite.receiver.username}

                                                                className="
                                    h-12
                                    w-12
                                    rounded-full
                                    object-cover
                                    "

                                                            />

                                                            <div>

                                                                <p className="text-white">

                                                                    {invite.receiver.fullName}

                                                                </p>

                                                                <p className="text-slate-400 text-sm">

                                                                    @{invite.receiver.username}

                                                                </p>

                                                            </div>

                                                        </div>

                                                        <div className="flex items-center gap-3">

                                                            <span
                                                                className="
        px-3
        py-1

        rounded-full

        bg-yellow-500/10

        text-yellow-400

        text-sm
        "
                                                            >
                                                                Pending
                                                            </span>

                                                            <button

                                                                onClick={() => {
                                                                    console.log(invite);
                                                                    handleCancelInvitation(invite._id);
                                                                }
                                                                }

                                                                className="
        px-3
        py-1

        rounded-lg

        bg-red-500/10

        text-red-400

        hover:bg-red-500/20

        transition
        "
                                                            >

                                                                Cancel

                                                            </button>

                                                        </div>

                                                    </div>

                                                ))

                                            }

                                        </div>

                                    </div>

                                )
                            }

                        </div>

                    </>

                )}


                {/* Announcements */}

                {activeTab === "announcements" && (

                    <div className="space-y-8">

                        {team.isOwner && (

                            <div
                                className="
                rounded-2xl

                bg-slate-800/40

                border
                border-blue-500/10

                p-6
                "
                            >

                                <h2 className="text-white text-xl font-semibold mb-5">

                                    {editingAnnouncement
                                        ? "Edit Announcement"
                                        : "New Announcement"}

                                </h2>

                                <input
                                    type="text"
                                    value={announcementTitle}
                                    onChange={(e) =>
                                        setAnnouncementTitle(e.target.value)
                                    }
                                    placeholder="Announcement title"

                                    className="
        w-full

        rounded-xl

        bg-slate-900/60

        border
        border-slate-700

        px-4
        py-3

        text-white

        outline-none

        focus:border-blue-500
    "
                                />

                                <textarea

                                    rows={5}

                                    value={announcementContent}

                                    onChange={(e) =>
                                        setAnnouncementContent(e.target.value)
                                    }

                                    placeholder="Write the announcement..."

                                    className="
        mt-4

        w-full

        rounded-xl

        bg-slate-900/60

        border
        border-slate-700

        p-4

        text-white

        resize-none

        outline-none

        focus:border-blue-500
    "
                                />

                                <div className="flex justify-end gap-3 mt-5">

                                    {editingAnnouncement && (

                                        <button

                                            onClick={() => {

                                                setEditingAnnouncement(null);

                                                setAnnouncementTitle("");

                                                setAnnouncementContent("");

                                            }}

                                            className="
                            px-5
                            py-2

                            rounded-xl

                            bg-slate-700

                            text-white
                            "
                                        >

                                            Cancel

                                        </button>

                                    )}

                                    <button

                                        disabled={announcementLoading}

                                        onClick={
                                            editingAnnouncement
                                                ? handleUpdateAnnouncement
                                                : handleCreateAnnouncement
                                        }

                                        className="
                        px-6
                        py-2

                        rounded-xl

                        bg-blue-600

                        hover:bg-blue-500

                        disabled:opacity-50

                        text-white
                        "
                                    >

                                        {announcementLoading

                                            ? "Saving..."

                                            : editingAnnouncement

                                                ? "Update"

                                                : "Post"}

                                    </button>

                                </div>

                            </div>

                        )}

                        {announcements.length === 0 ? (

                            <div
                                className="
                rounded-2xl

                border
                border-dashed
                border-slate-700

                p-12

                text-center

                text-slate-500
                "
                            >

                                <Megaphone
                                    size={42}
                                    className="mx-auto mb-4 opacity-60"
                                />

                                <p>

                                    No announcements yet.

                                </p>

                            </div>

                        ) : (

                            <div className="space-y-5">

                                {[...announcements].sort((a, b) => {

                                    if (a.isPinned === b.isPinned) {

                                        return (
                                            new Date(b.createdAt) -
                                            new Date(a.createdAt)
                                        );

                                    }

                                    return b.isPinned - a.isPinned;

                                }).map(
                                    announcement => (

                                        <div

                                            key={announcement._id}

                                            className={`
rounded-2xl

p-6

transition-all

${announcement.isPinned

                                                    ?

                                                    "bg-gradient-to-r from-yellow-500/10 to-slate-800 border border-yellow-500/30"

                                                    :

                                                    "bg-slate-800/40 border border-blue-500/10"

                                                }
`}
                                        >

                                            <div className="flex justify-between">

                                                <div className="flex gap-4">

                                                    <img

                                                        src={
                                                            announcement.createdBy.avatar
                                                        }

                                                        alt={
                                                            announcement.createdBy.username
                                                        }

                                                        className="
                                        w-12
                                        h-12

                                        rounded-full
                                        object-cover
                                        "
                                                    />

                                                    <div>

                                                        <h3 className="text-white font-semibold">

                                                            {
                                                                announcement.createdBy.fullName
                                                            }

                                                        </h3>

                                                        <p className="text-xs text-slate-500">

                                                            @
                                                            {
                                                                announcement.createdBy.username
                                                            }

                                                        </p>

                                                        <p className="text-xs text-slate-600 mt-1">

                                                            {new Date(
                                                                announcement.createdAt
                                                            ).toLocaleDateString()}

                                                            •

                                                            {new Date(
                                                                announcement.createdAt
                                                            ).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit"
                                                            })}

                                                        </p>

                                                    </div>

                                                </div>

                                                {team.isOwner && (

                                                    <div className="flex gap-2">

                                                        <button

                                                            onClick={() =>
                                                                handleTogglePin(
                                                                    announcement._id
                                                                )
                                                            }

                                                            className={`
            px-3
            py-1

            rounded-lg

            transition

            ${announcement.isPinned

                                                                    ? "bg-yellow-500 text-black"

                                                                    : "bg-slate-700 text-yellow-400 hover:bg-slate-600"
                                                                }
        `}
                                                        >

                                                            {announcement.isPinned
                                                                ? "📌 Unpin"
                                                                : "📌 Pin"}

                                                        </button>

                                                        <button

                                                            onClick={() => {

                                                                setEditingAnnouncement(
                                                                    announcement
                                                                );

                                                                setAnnouncementTitle(
                                                                    announcement.title
                                                                );

                                                                setAnnouncementContent(
                                                                    announcement.content
                                                                );

                                                            }}

                                                            className="
            px-3
            py-1

            rounded-lg

            bg-yellow-500/10

            text-yellow-400
        "
                                                        >

                                                            Edit

                                                        </button>

                                                        <button

                                                            onClick={() =>
                                                                handleDeleteAnnouncement(
                                                                    announcement._id
                                                                )
                                                            }

                                                            className="
            px-3
            py-1

            rounded-lg

            bg-red-500/10

            text-red-400
        "
                                                        >

                                                            Delete

                                                        </button>

                                                    </div>

                                                )}

                                            </div>

                                            <div className="mt-5 flex items-start justify-between">

                                                <div>

                                                    <h2
                                                        className="
                text-xl

                font-bold

                text-white

                flex

                items-center

                gap-2
            "
                                                    >

                                                        <div className="flex items-center gap-3">

                                                            {announcement.isPinned && (

                                                                <div
                                                                    className="
                rounded-full

                bg-yellow-500

                px-2
                py-1

                text-xs

                font-bold

                text-black
            "
                                                                >
                                                                    PINNED
                                                                </div>

                                                            )}

                                                            <h2 className="text-2xl font-bold text-white">

                                                                {announcement.title}

                                                            </h2>

                                                        </div>

                                                    </h2>

                                                    <p
                                                        className="
                mt-4

                text-slate-300

                leading-8

                whitespace-pre-wrap
            "
                                                    >

                                                        {announcement.content}

                                                    </p>

                                                </div>

                                                {announcement.isPinned && (

                                                    <span
                                                        className="
                px-3
                py-1

                rounded-full

                bg-yellow-500/10

                border
                border-yellow-500/20

                text-yellow-400

                text-xs
            "
                                                    >

                                                        📌 Pinned

                                                    </span>

                                                )}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                )}

                {/* Resources */}

                {activeTab === "resources" && (

                    <ResourcesTab

                        teamId={team._id}

                        isOwner={team.isOwner}

                    />

                )}

             

            </div>
            <CreateTaskModal

                open={showCreateTask}

                onClose={() => setShowCreateTask(false)}

                team={team}

                refreshTasks={fetchTeam}

            />
            <TaskDetailsModal
                open={showTaskDetails}
                task={selectedTask}
                members={team.members}
                refreshTasks={fetchTeam}
                setSelectedTask={setSelectedTask}
                onClose={() => {
                    setShowTaskDetails(false);
                    setSelectedTask(null);
                }}
            />

            <InviteMemberModal

                open={showInviteModal}

                onClose={() => setShowInviteModal(false)}

                teamId={team._id}

                onInvite={async () => {

                    await fetchTeam();

                    setShowInviteModal(false);

                }}

            />

        </div>

    );

}

export default TeamDetails;