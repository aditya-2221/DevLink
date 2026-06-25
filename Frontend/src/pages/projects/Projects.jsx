import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProjectCard from "../../components/cards/ProjectCard";
import { getProjects, getTrendingProjects, getMyProjects } from "../../services/projectService";
import { FiPlus } from "react-icons/fi";
import {
  setProjects,
  setLoading,
  setError,
  setPagination
} from "../../features/projects/projectSlice";
import { useNavigate } from "react-router-dom";

function Projects() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("feed");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("latest");
  const fetchProjects = async () => {

    try {

      dispatch(setLoading(true));

      let response;

      switch (activeTab) {

        case "trending":
          response = await getTrendingProjects();
          dispatch(
            setProjects(response.data.data)
          );

          break;

        case "newest":
          response = await getProjects({
            sort: "latest"
          });

          dispatch(
            setProjects(
              response.data.data.projects
            )
          );

          dispatch(
            setPagination({
              page: response.data.data.page,
              totalPages:
                response.data.data.totalPages,
              totalProjects:
                response.data.data.totalProjects
            })
          );

          break;

        case "my-projects":

          response = await getMyProjects();

          dispatch(
            setProjects(response.data.data)
          );

          break;

        default:
          response = await getProjects({
            search,
            category,
            sort,
            page: currentPage,
            limit: 10
          });

          dispatch(
            setProjects(
              response.data.data.projects
            )
          );

          dispatch(
            setPagination({
              page: response.data.data.page,
              totalPages: response.data.data.totalPages,
              totalProjects: response.data.data.totalProjects
            })
          );
      }

    } catch (error) {

      dispatch(
        setError(
          error.response?.data?.message ||
          "Failed to fetch projects"
        )
      );

    } finally {

      dispatch(setLoading(false));

    }
  };

  useEffect(() => {
    fetchProjects();
  }, [
    activeTab,
    currentPage,
    search,
    category,
    sort
  ]);

  const tabs = [
    "feed",
    "trending",
    "newest",
    "my-projects"
  ];
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    search,
    category,
    sort
  ]);

  const {
    projects,
    loading,
    error,
    totalPages,
    totalProjects
  } = useSelector(
    (state) => state.projects
  );





  if (loading) {
    return <h1>Loading Projects...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex justify-between items-start mb-8">

        <div>
          <h1 className="text-5xl font-bold text-white">
            Projects
          </h1>

          <p className="text-slate-400 mt-2">
            Discover and showcase amazing projects
            {activeTab === "feed" &&
              ` • ${totalProjects || 0} Projects`}
          </p>
        </div>

        <button
          onClick={() => navigate("/projects/create")}
          className="
    flex
    items-center
    gap-2
    px-4
    py-2
    rounded-lg
    bg-blue-600
    hover:bg-blue-500
    text-white
    text-sm
    font-medium
    transition
  "
        >
          <FiPlus size={16} />
          New Project
        </button>

      </div>


      {/* Filters */}

      <div className="flex gap-3 flex-wrap">

        {tabs.map((tab) => (

          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
        px-5
        py-2.5
        rounded-xl
        font-medium
        transition-all
        duration-300

        ${activeTab === tab
                ? `
              bg-blue-600
              text-white
              shadow-[0_0_20px_rgba(37,99,235,0.35)]
              border
              border-blue-500/50
            `
                : `
              bg-slate-900/60
              text-slate-200
              border
              border-slate-800
              hover:text-white
              hover:border-blue-500/30
              hover:-translate-y-1
            `
              }
      `}
          >
            {tab
              .replace("-", " ")
              .replace(/\b\w/g, c => c.toUpperCase())}
          </button>

        ))}

      </div>

      {/* Projects */}

      {projects?.length === 0 ? (
        <div
          className="
  flex
  flex-col
  items-center
  justify-center
  py-20
  "
        >
          <h2 className="text-2xl text-white">
            No Projects Found
          </h2>

          <p className="text-slate-400 mt-2">
            Create your first project and showcase it.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
            />
          ))}
        </div>
      )}
      {
        (activeTab === "feed" ||
          activeTab === "newest") && (

          <div
            className="
            flex
            justify-center
            items-center
            gap-4
            mt-10
        "
          >

            <button
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  prev => prev - 1
                )
              }
              className="
                px-4
                py-2
                rounded-lg
                bg-slate-800
                text-white
                disabled:opacity-50
            "
            >
              Previous
            </button>

            <span
              className="
                text-white
                font-medium
            "
            >
              Page {currentPage}
              {" / "}
              {totalPages || 1}
            </span>

            <button
              disabled={
                currentPage >= totalPages
              }
              onClick={() =>
                setCurrentPage(
                  prev => prev + 1
                )
              }
              className="
                px-4
                py-2
                rounded-lg
                bg-slate-800
                text-white
                disabled:opacity-50
            "
            >
              Next
            </button>

          </div>

        )
      }
    </div>
  );
}

export default Projects;