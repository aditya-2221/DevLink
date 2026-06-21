import {
    FaHeart,
    FaBookmark,
    FaGithub,
    FaExternalLinkAlt,
    FaComment
} from "react-icons/fa";

function ProjectActions({
    project,
    onLike,
    onBookmark
}) {
    return (
        <div className="flex flex-wrap gap-3 mt-6">

            <button
                onClick={onLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300  transition-all duration-300 ${project.isLiked
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-slate-800 hover:bg-slate-700"
                    }`}
            >
                <FaHeart />
                {project.likesCount}
                {project.isLiked ? " Liked" : " Like"}
            </button>

            <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 bg-slate-800 transition-all duration-300" >
                <FaComment />
                {project.commentsCount}
            </div>

            <button
                onClick={onBookmark}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300  transition-all duration-300 ${project.isBookmarked
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-slate-800 hover:bg-slate-700"
                    }`}
            >
                <FaBookmark />
                {project.isBookmarked ? " Saved" : " Save"}
            </button>

            {project.githubLink && (
                <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700"
                >
                    <FaGithub />
                    GitHub
                </a>
            )}

            {project.liveDemoLink && (
                <a
                    href={project.liveDemoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
                >
                    <FaExternalLinkAlt />
                    Live Demo
                </a>
            )}

        </div>
    );
}

export default ProjectActions;