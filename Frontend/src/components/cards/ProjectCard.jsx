import { FaHeart, FaCommentDots } from "react-icons/fa";
import { BsBookmarkFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div
      className="
      bg-slate-900/50
      backdrop-blur-xl
      border
      border-blue-500/10
      rounded-xl
      w-full
      overflow-hidden
     hover:-translate-y-1
hover:shadow-[0_0_25px_rgba(37,99,235,0.15)]
transition-all
duration-300
      "
    >
      {/* Project Image */}

      <img
        src={
          project?.images?.[0]?.url ||
          "https://placehold.co/600x400"
        }
        alt={project?.title}
        className="w-full  h-40 object-cover"
      />

      {/* Content */}

      <div className="p-5">
        <h2 className="text-white text-xl font-semibold mb-2">
          {project?.title}
        </h2>

        <p className="text-slate-400 text-sm line-clamp-2">
          {project?.description}
        </p>

        {/* Tech Stack */}

        <div className="flex flex-wrap gap-2 mt-4">
          {project?.techStack?.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="
              px-3
              py-1
              text-xs
              rounded-full
              bg-blue-500/10
              text-blue-300
              border
              border-blue-500/20
              "
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Stats */}

        <div className="flex items-center gap-5 mt-5 text-slate-400">
          <div className="flex items-center gap-2">
            <FaHeart />
            <span>{project?.likesCount || 0}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaCommentDots />
            <span>
              {project?.commentsCount || 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <BsBookmarkFill />
            <span>
              {project?.bookmarksCount || 0}
            </span>
          </div>
        </div>

        {/* Footer */}

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-3">
            <img
              src={
                project?.owner?.avatar ||
                "https://i.pravatar.cc/100"
              }
              alt={project?.owner?.fullName}
              className="
              w-10
              h-10
              rounded-full
              border
              border-blue-500/20
              "
            />

            <div>
              <p className="text-white text-sm font-medium">
                {project?.owner?.fullName || "Unknown"}
              </p>

              <p className="text-slate-500 text-xs">
                Developer
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              navigate(`/projects/${project._id}`)
            }
            className="
            px-4
            py-2
            bg-blue-600
            hover:bg-blue-700
            rounded-lg
            text-sm
            transition
            "
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;