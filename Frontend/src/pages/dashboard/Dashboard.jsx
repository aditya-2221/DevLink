import {
  FolderGit2,
  Users,
  Briefcase,
  Bell,
  TrendingUp,
  Clock,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate()
  const stats = [
    {
      title: "Projects",
      value: "12",
      icon: FolderGit2,
    },
    {
      title: "Teams",
      value: "4",
      icon: Users,
    },
    {
      title: "Applications",
      value: "7",
      icon: Briefcase,
    },
    {
      title: "Notifications",
      value: "14",
      icon: Bell,
    },
  ];

  const recentProjects = [
    "DevLink Platform",
    "AI Resume Analyzer",
    "Expense Tracker",
    "Chat Application",
  ];

  const trendingProjects = [
    {
      title: "DevLink Platform",
      tech: "MERN Stack",
    },
    {
      title: "AI Resume Analyzer",
      tech: "Next.js + OpenAI",
    },
    {
      title: "Expense Tracker",
      tech: "React + MongoDB",
    },
  ];

  return (
    <div className="space-y-8">
      <div
        className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-8"
      />
      {/* Welcome */}
      <div>
        <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          Welcome Back, Aditya 👋
        </h1>

        <p className="text-slate-400 mt-2">
          Build something amazing today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                p-6
                hover:border-blue-500
                transition
                hover:scale-[1.02] hover:border-blue-500/30 hover:shadow-[0_0_35px_rgba(59,130,246,0.15)] transition-all duration-300 "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400">
                    {item.title}
                  </p>

                  <h2 className="text-4xl font-bold text-white mt-2">
                    {item.value}
                  </h2>
                </div>

                <Icon
                  size={32}
                  className="text-blue-500"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity + Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-5">
            Recent Activity
          </h2>

          <div className="space-y-5">
            <div className="flex gap-3">
              <Clock
                size={18}
                className="text-blue-500 mt-1"
              />
              <div>
                <p className="text-white">
                  Rahul liked your project.
                </p>
                <span className="text-slate-500 text-sm">
                  2 hours ago
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock
                size={18}
                className="text-blue-500 mt-1"
              />
              <div>
                <p className="text-white">
                  New recruitment application.
                </p>
                <span className="text-slate-500 text-sm">
                  5 hours ago
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock
                size={18}
                className="text-blue-500 mt-1"
              />
              <div>
                <p className="text-white">
                  Comment added on DevLink.
                </p>
                <span className="text-slate-500 text-sm">
                  Yesterday
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-5">
            Quick Actions
          </h2>

          <div className="space-y-4">
            <button onClick={() => navigate("/projects/create")}
              className="
                w-full
                bg-blue-600
                hover:bg-blue-700
                transition
                rounded-lg
                py-3
                font-medium
              "
            >
              Create Project
            </button>

            <button
              className="
                w-full
                bg-slate-800
                hover:bg-slate-700
                transition
                rounded-lg
                py-3
                font-medium
              "
            >
              Browse Recruitments
            </button>

            <button
              className="
                w-full
                bg-slate-800
                hover:bg-slate-700
                transition
                rounded-lg
                py-3
                font-medium
              "
            >
              Find Teams
            </button>
          </div>
        </div>
      </div>

      {/* Trending */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-green-500" />
          <h2 className="text-xl font-semibold text-white">
            Trending Projects
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {trendingProjects.map((project, index) => (
            <div
              key={index}
              className="
                bg-slate-800
                rounded-lg
                p-4
                border
                border-slate-700
              "
            >
              <h3 className="text-white font-semibold">
                {project.title}
              </h3>

              <p className="text-slate-400 mt-2 text-sm">
                {project.tech}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-5">
          Recent Projects
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {recentProjects.map((project, index) => (
            <div
              key={index}
              className="
                bg-slate-800
                border
                border-slate-700
                rounded-lg
                p-4
              "
            >
              <h3 className="text-white font-medium">
                {project}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;