import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { getMyProjects } from "../../services/projectService";

function ProfileProjects({
    onStatsLoaded,
    showAll = false,
    setActiveTab
}) {

    const [projects, setProjects] = useState([]);

    useEffect(() => {

        const fetchProjects = async () => {

            const response = await getMyProjects();

            const projects = response.data.data;

            setProjects(projects);
            const stats = {

                projects:
                    projects.length,

                likes:
                    projects.reduce(
                        (total, project) =>
                            total +
                            (project.likesCount || 0),
                        0
                    ),

                bookmarks:
                    projects.reduce(
                        (total, project) =>
                            total +
                            (project.bookmarksCount || 0),
                        0
                    ),
            };

            onStatsLoaded?.(stats);
        };

        fetchProjects();

    }, []);

    return (
        <div>

            <div
                className="
    flex
    justify-between
    items-center
    mb-5
    "
            >
                <h2
                    className="
        text-3xl
        font-bold
        text-white
        "
                >
                    My Projects
                </h2>

                {!showAll && (
                    <button
                        onClick={() =>
                            setActiveTab("projects")
                        }
                        className="
            text-blue-400
            hover:text-blue-300
            text-sm
            font-medium
            transition
            "
                    >
                        View All →
                    </button>
                )}
            </div>

            {projects.length === 0 ? (

                <div
                    className="
    bg-slate-900/50
    border
    border-slate-800
    rounded-2xl
    p-8
    text-center
    "
                >
                    <h3 className="text-white text-xl font-semibold">
                        No Projects Yet
                    </h3>

                    <p className="text-slate-400 mt-2">
                        Create your first project and showcase it.
                    </p>
                </div>

            ) : (

                <div
                    className="
    grid
    grid-cols-1
    md:grid-cols-2
    gap-6
    "
                >
                    {(showAll ? projects : projects.slice(0, 2)).map((project) => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                        />
                    ))}
                </div>

            )}

        </div>
    );
}

export default ProfileProjects;