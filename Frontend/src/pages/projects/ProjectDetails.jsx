import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OwnerCard from "../../components/cards/OwnerCard";
import ProjectActions from "../../components/cards/ProjectActions";
import {
    setCurrentProject,
    setLoading,
    setError,
    clearCurrentProject
} from "../../features/projects/projectSlice";
import CommentSection from "../../components/comments/CommentSection";
import { getProjectById } from "../../services/projectService";
import {
    likeProject,
    unlikeProject
} from "../../services/projectService";

import {
    bookmarkProject,
    removeBookmark
} from "../../services/projectService";

import {
    toggleBookmark
} from "../../features/projects/projectSlice";

import {
    toggleLike
} from "../../features/projects/projectSlice";

function ProjectDetails() {
    const { projectId } = useParams();

    const dispatch = useDispatch();

    const {
        currentProject,
        loading,
        error
    } = useSelector((state) => state.projects);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                dispatch(setLoading(true));

                const response = await getProjectById(projectId);

                dispatch(setCurrentProject(response.data.data));
            } catch (error) {
                dispatch(
                    setError(
                        error.response?.data?.message ||
                        "Failed to fetch project"
                    )
                );
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchProject();

        return () => {
            dispatch(clearCurrentProject());
        };
    }, [projectId, dispatch]);

    if (loading) {
        return (
            <div className="p-6">
                <h1>Loading...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-red-500">
                {error}
            </div>
        );
    }

    if (!currentProject) {
        return (
            <div className="p-6">
                Project not found
            </div>
        );
    }

    const handleLike = async () => {
        try {
            console.log("LIKE CLICKED");
            dispatch(toggleLike(currentProject._id));

            if (currentProject.isLiked) {
                await unlikeProject(currentProject._id);
            } else {
                await likeProject(currentProject._id);
            }
        } catch (error) {
            dispatch(toggleLike(currentProject._id));
            console.log(error);
        }
    }

    const handleBookmark = async () => {
        try {
            dispatch(toggleBookmark(currentProject._id));

            if (currentProject.isBookmarked) {
                await removeBookmark(currentProject._id);
            } else {
                await bookmarkProject(currentProject._id);
            }
        } catch (error) {
            dispatch(toggleBookmark(currentProject._id));
            console.log(error);
        }
    }



    return (
        <div className="max-w-6xl mx-auto p-6">

            <img
                src={
                    currentProject.images?.[0]?.url ||
                    "https://placehold.co/1200x500"
                }
                alt={currentProject.title}
                className="w-full h-[450px] object-cover rounded-xl"
            />

            <div className="mt-6">

                <h1 className="text-white text-4xl font-bold">
                    {currentProject.title}
                </h1>

                <p className="text-slate-300 mt-4">
                    {currentProject.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-6">
                    {currentProject.techStack?.map((tech) => (
                        <span
                            key={tech}
                            className="px-3 py-1 rounded-full bg-blue-600"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                <ProjectActions
                    project={currentProject}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                />

                <OwnerCard owner={currentProject.owner} />
                <CommentSection
                    projectId={currentProject._id}
                />



            </div>

        </div>
    );
}

export default ProjectDetails;