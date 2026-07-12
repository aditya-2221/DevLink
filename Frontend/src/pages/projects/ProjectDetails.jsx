import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


import OwnerCard from "../../components/cards/OwnerCard";
import ProjectActions from "../../components/cards/ProjectActions";
import CommentSection from "../../components/comments/CommentSection";

import AIActionCard from "../../components/AI/AIActionCard";
import AIOutput from "../../components/AI/AIOutput";

import {
    setCurrentProject,
    setLoading,
    setError,
    clearCurrentProject,
    toggleBookmark,
    toggleLike,
    removeProject
} from "../../features/projects/projectSlice";

import {
    generateDescription,
    generateReadme,
    generateReport,
    reviewProject,
    clearAIOutput
} from "../../features/ai/aiSlice";

import {
    getProjectById,
    likeProject,
    unlikeProject,
    bookmarkProject,
    removeBookmark,
    deleteProject
} from "../../services/projectService";

function ProjectDetails() {

    const { projectId } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("overview");
    const [showEditModal, setShowEditModal] = useState(false);

    const {

        currentProject,

        loading,

        error

    } = useSelector(

        state => state.projects

    );

    const {

        loading: aiLoading,

        output,

        error: aiError

    } = useSelector(

        state => state.ai

    );

    useEffect(() => {

        const fetchProject = async () => {

            try {

                dispatch(setLoading(true));

                const response =
                    await getProjectById(projectId);

                dispatch(
                    setCurrentProject(
                        response.data.data
                    )
                );

            }

            catch (error) {

                dispatch(

                    setError(

                        error.response?.data?.message ||

                        "Failed to fetch project"

                    )

                );

            }

            finally {

                dispatch(setLoading(false));

            }

        };

        fetchProject();

        return () => {

            dispatch(clearCurrentProject());

            dispatch(clearAIOutput());

        };

    }, [projectId, dispatch]);

    if (loading) {

        return (

            <div className="p-8 text-white">

                Loading...

            </div>

        );

    }

    if (error) {

        return (

            <div className="p-8 text-red-500">

                {error}

            </div>

        );

    }

    if (!currentProject) {

        return (

            <div className="p-8 text-white">

                Project not found

            </div>

        );

    }

    const handleLike = async () => {

        try {

            dispatch(

                toggleLike(currentProject._id)

            );

            if (currentProject.isLiked) {

                await unlikeProject(

                    currentProject._id

                );

            }

            else {

                await likeProject(

                    currentProject._id

                );

            }

        }

        catch (error) {

            dispatch(

                toggleLike(currentProject._id)

            );

        }

    };

    const handleBookmark = async () => {

        try {

            dispatch(

                toggleBookmark(currentProject._id)

            );

            if (currentProject.isBookmarked) {

                await removeBookmark(

                    currentProject._id

                );

            }

            else {

                await bookmarkProject(

                    currentProject._id

                );

            }

        }

        catch (error) {

            dispatch(

                toggleBookmark(currentProject._id)

            );

        }

    };

    const handleEdit = () => {
        navigate(`/projects/${projectId}/edit`);
    };

    const handleDelete = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) return;

        try {

            dispatch(setLoading(true));

            await deleteProject(
                currentProject._id
            );

            dispatch(
                removeProject(
                    currentProject._id
                )
            );

            alert(
                "Project deleted successfully"
            );

            navigate("/projects");

        }

        catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to delete project"
            );

        }

        finally {

            dispatch(setLoading(false));

        }

    };

    const handleGenerateDescription = () => {

        dispatch(

            generateDescription(

                currentProject._id

            )

        );

    };

    const handleGenerateReadme = () => {

        dispatch(

            generateReadme(

                currentProject._id

            )

        );

    };

    const handleGenerateReport = () => {

        dispatch(

            generateReport(

                currentProject._id

            )

        );

    };

    const handleReview = () => {

        dispatch(

            reviewProject(

                currentProject._id

            )

        );

    };


    return (

        <div className="max-w-7xl mx-auto p-6 space-y-8">

            <div
                className="
            relative

            h-[420px]

            overflow-hidden

            rounded-3xl
        "
            >

                <img

                    src={
                        currentProject.images?.[0]?.url ||
                        "https://placehold.co/1400x700"
                    }

                    alt={currentProject.title}

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

                <div
                    className="
                absolute

                bottom-8

                left-8

                right-8
            "
                >

                    <h1
                        className="
                    text-5xl

                    font-bold

                    text-white
                "
                    >

                        {currentProject.title}

                    </h1>

                    <p
                        className="
                    mt-4

                    max-w-4xl

                    text-slate-300
                "
                    >

                        {currentProject.description}

                    </p>

                    <div
                        className="
                    mt-6

                    flex

                    flex-wrap

                    gap-3
                "
                    >

                        {

                            currentProject.techStack?.map(

                                tech => (

                                    <span

                                        key={tech}

                                        className="
                                    rounded-full

                                    bg-blue-600/20

                                    px-4

                                    py-2

                                    text-sm

                                    text-blue-300
                                "

                                    >

                                        {tech}

                                    </span>

                                )

                            )

                        }

                    </div>

                </div>

            </div>

            <ProjectActions
                project={currentProject}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <OwnerCard

                owner={currentProject.owner}

            />

            <div
                className="
            flex

            gap-3

            border-b

            border-slate-800

            pb-4
        "
            >

                {

                    [

                        {

                            id: "overview",

                            label: "Overview"

                        },

                        {

                            id: "comments",

                            label: "Comments"

                        },

                        {

                            id: "ai",

                            label: "🤖 AI Assistant"

                        }

                    ].map(

                        tab => (

                            <button

                                key={tab.id}

                                onClick={() =>
                                    setActiveTab(tab.id)
                                }

                                className={`

                            px-5

                            py-2.5

                            rounded-xl

                            transition

                            ${activeTab === tab.id

                                        ?

                                        "bg-blue-600 text-white"

                                        :

                                        "bg-slate-900 text-slate-300 hover:bg-slate-800"

                                    }

                        `}

                            >

                                {tab.label}

                            </button>

                        )

                    )

                }

            </div>

            {

                activeTab === "overview"

                &&

                (

                    <div
                        className="
                    rounded-2xl

                    border

                    border-slate-800

                    bg-slate-900/40

                    p-8
                "
                    >

                        <h2
                            className="
                        text-2xl

                        font-semibold

                        text-white
                    "
                        >

                            Project Overview

                        </h2>

                        <p
                            className="
                        mt-5

                        leading-8

                        text-slate-300
                    "
                        >

                            {currentProject.description}

                        </p>

                    </div>

                )

            }

            {

                activeTab === "comments"

                &&

                (

                    <CommentSection

                        projectId={
                            currentProject._id
                        }

                    />

                )

            }

            {

                activeTab === "ai"

                &&

                (

                    <div className="space-y-8">

                        <div
                            className="
                        grid

                        md:grid-cols-2

                        gap-6
                    "
                        >

                            <AIActionCard

                                title="Generate Description"

                                description="Generate a professional project description."

                                onClick={handleGenerateDescription}

                                loading={aiLoading}

                            />

                            <AIActionCard

                                title="Generate README"

                                description="Generate a complete GitHub README."

                                onClick={handleGenerateReadme}

                                loading={aiLoading}

                            />

                            <AIActionCard

                                title="Generate Report"

                                description="Generate a professional mini project report."

                                onClick={handleGenerateReport}

                                loading={aiLoading}

                            />

                            <AIActionCard

                                title="Review Project"

                                description="Get AI suggestions for improving this project."

                                onClick={handleReview}

                                loading={aiLoading}

                            />

                        </div>
                        {

                            aiLoading && (

                                <div
                                    className="
                                rounded-2xl

                                border

                                border-blue-500/20

                                bg-slate-900/40

                                p-10

                                text-center
                            "
                                >

                                    <div
                                        className="
                                    w-12

                                    h-12

                                    mx-auto

                                    rounded-full

                                    border-4

                                    border-blue-500

                                    border-t-transparent

                                    animate-spin
                                "
                                    />

                                    <p
                                        className="
                                    mt-6

                                    text-slate-300
                                "
                                    >

                                        DevLink AI is generating your response...

                                    </p>

                                </div>

                            )

                        }

                        {

                            aiError && (

                                <div
                                    className="
                                rounded-2xl

                                border

                                border-red-500/20

                                bg-red-500/10

                                p-6

                                text-red-400
                            "
                                >

                                    {aiError}

                                </div>

                            )

                        }

                        {

                            !aiLoading && (

                                <AIOutput

                                    output={output}

                                />

                            )

                        }

                    </div>

                )

            }

        </div>

    );

}

export default ProjectDetails;
