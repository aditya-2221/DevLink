import {
  FolderGit2,
  Users,
  Briefcase,
  Bell,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus
} from "lucide-react";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

import { getMyProjects, getTrendingProjects } from "../../services/projectService";
import { getMyRecruitments } from "../../services/recruitmentService";
import { getMyTeams } from "../../services/teamService";
import { getNotifications } from "../../services/notificationService";


const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    projects: 0,
    teams: 0,
    recruitments: 0,
    notifications: 0
  });

  const [recentProjects, setRecentProjects] = useState([]);

  const [trendingProjects, setTrendingProjects] = useState([]);

  const [recentNotifications, setRecentNotifications] = useState([]);

  const { user } = useSelector(state => state.auth);

  const greeting = (() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  })();

  const [loading, setLoading] = useState(true);
  useEffect(() => {

    const loadDashboard = async () => {

      try {

        setLoading(true);

        const [

          projectRes,

          recruitmentRes,

          teamRes,

          notificationRes,

          trendingRes

        ] = await Promise.all([

          getMyProjects(),

          getMyRecruitments(),

          getMyTeams(),

          getNotifications({

            limit: 3

          }),

          getTrendingProjects()

        ]);

        const myProjects =
          projectRes.data.data || [];

        const myRecruitments =
          recruitmentRes.data.data.recruitments || [];

        const myTeams =
          teamRes.data.data || [];

        const notifications =
          notificationRes.data.data.myNotifications || [];

        const trending =
          trendingRes.data.data || [];

        setStats({

          projects: myProjects.length,

          recruitments: myRecruitments.length,

          teams: myTeams.length,

          notifications:
            notificationRes.data.data.unreadCount

        });

        setRecentProjects(

          myProjects.slice(0, 4)

        );

        setTrendingProjects(

          trending.slice(0, 3)

        );

        setRecentNotifications(

          notifications

        );

      }

      catch (error) {

        console.log(error);

      }

      finally {

        setLoading(false);

      }

    };

    loadDashboard();

  }, []);

  const statCardConfig = {
    Projects: {
      bg: "from-blue-500/20 to-blue-500/5",
      border: "border-blue-500/20",
      text: "text-blue-400"
    },

    Recruitments: {
      bg: "from-violet-500/20 to-violet-500/5",
      border: "border-violet-500/20",
      text: "text-violet-400"
    },

    Teams: {
      bg: "from-emerald-500/20 to-emerald-500/5",
      border: "border-emerald-500/20",
      text: "text-emerald-400"
    },

    Notifications: {
      bg: "from-amber-500/20 to-amber-500/5",
      border: "border-amber-500/20",
      text: "text-amber-400"
    }
  };

  return (
    <div className="relative">
      <div
        className="
        pointer-events-none

        absolute

        inset-0

        overflow-hidden
    "
      >

        <div
          className="
            absolute

            -top-40

            left-0

            h-[500px]

            w-[500px]

            rounded-full

            bg-blue-600/10

            blur-[160px]
        "
        />

        <div
          className="
            absolute

            bottom-0

            right-0

            h-[450px]

            w-[450px]

            rounded-full

            bg-violet-600/10

            blur-[160px]
        "
        />

      </div>
      <div
        className="
        min-h-screen

        space-y-8

        bg-[#060B18]

        text-white
    "
      >
        <div
          className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-8"
        />
        {/* Welcome */}
        <div
          className="
        relative

        overflow-hidden

        rounded-3xl

        border
       border-[#1A2745]

        bg-gradient-to-br

       from-[#0B1225]
via-[#101A34]
to-[#081328]

        p-8
    "
        >

          <div
            className="
            absolute

            -right-20
            -top-20

            h-72
            w-72

            rounded-full

            bg-blue-500/10

            blur-3xl
        "
          />

          <div
            className="
            relative

            flex

            items-center

            justify-between
        "
          >

            <div>

              <span
                className="
                    inline-flex

                    items-center

                    gap-2

                    rounded-full

                    border

                    border-blue-500/20

                    bg-blue-500/10

                    px-4

                    py-1.5

                    text-sm

                    text-blue-300
                "
              >

                ✨ {greeting}

              </span>

              <h1
                className="
                    mt-6

                    text-5xl

                    font-bold

                    tracking-tight

                    text-white
                "
              >

                Welcome back,

                <span className="text-blue-400">

                  {" "}{user?.fullName}

                </span>

                👋

              </h1>

              <p
                className="
                    mt-5

                    max-w-2xl

                    text-lg

                    leading-8

                    text-slate-400
                "
              >

                Build amazing projects, collaborate with talented developers,
                manage teams, and grow your developer portfolio—all from one workspace.

              </p>

              <div className="mt-8 flex gap-4">

                <button

                  onClick={() => navigate("/projects")}

                  className="
                        rounded-xl

                        bg-blue-600

                        px-5

                        py-3

                        font-medium

                        text-white

                        transition

                        hover:bg-blue-500
                    "

                >

                  Explore Projects

                </button>

                <button

                  onClick={() => navigate("/profile")}

                  className="
                        rounded-xl

                        border

                        border-slate-700

                        bg-slate-800/60

                        px-5

                        py-3

                        font-medium

                        text-slate-300

                        transition

                        hover:border-blue-500/30

                        hover:text-white
                    "

                >

                  View Profile

                </button>

              </div>

            </div>

            <div className="hidden lg:flex flex-col items-center">

              <div className="relative">

                <img

                  src={user?.avatar}

                  alt={user?.fullName}

                  className="
                        h-28
                        w-28

                        rounded-full

                        border-4

                       border-[#1A2745]

                        object-cover
                    "

                />

                <div
                  className="
                        absolute

                        bottom-1
                        right-1

                        h-5
                        w-5

                        rounded-full

                        border-4

                        border-slate-900

                        bg-emerald-400
                    "
                />

              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">

                {user?.fullName}

              </h3>

              <p className="mt-1 text-sm text-slate-500">

                @{user?.username}

              </p>

            </div>

          </div>

        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            {
              title: "Projects",
              value: stats.projects,
              icon: FolderGit2
            },
            {
              title: "Recruitments",
              value: stats.recruitments,
              icon: Briefcase
            },
            {
              title: "Teams",
              value: stats.teams,
              icon: Users
            },
            {
              title: "Notifications",
              value: stats.notifications,
              icon: Bell
            }
          ].map(item => {

            const Icon = item.icon;
            const colors = statCardConfig[item.title];

            return (

              <div
                key={item.title}
                onClick={() => {

                  switch (item.title) {

                    case "Projects":
                      navigate("/projects");
                      break;

                    case "Recruitments":
                      navigate("/recruitments");
                      break;

                    case "Teams":
                      navigate("/teams");
                      break;

                    case "Notifications":
                      navigate("/notifications");
                      break;

                  }

                }}
                className="
        group

        relative

        overflow-hidden

        rounded-3xl

        border border-[#1A2745]

        bg-[#0E162D]/90

        backdrop-blur-xl

        p-7

        transition-all
        duration-300

        hover:-translate-y-1

        hover:border-blue-500/30

        hover:shadow-lg
        hover:shadow-blue-500/5
    "
              >

                <div
                  className="
            absolute

            -right-10
            -top-10

            h-32
            w-32

            rounded-full

            bg-blue-500/5

            blur-2xl

            opacity-0

            transition

            group-hover:opacity-100
        "
                />

                <div className="relative">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm font-medium text-slate-400">

                        {item.title}

                      </p>

                      <h2 className="mt-4 text-5xl font-bold tracking-tight text-white">

                        {loading ? "--" : item.value}

                      </h2>

                    </div>

                    <div
                      className={`
        flex
        h-16
        w-16
        items-center
        justify-center

        rounded-2xl

        bg-gradient-to-br

        ${colors.bg}

        border

        ${colors.border}
    `}
                    >

                      <Icon
                        size={30}
                        className={colors.text}
                      />

                    </div>

                  </div>

                  <div
                    className="
                mt-6

                flex

                items-center

                justify-between
            "
                  >

                    <p className="text-sm text-slate-500">

                      {
                        item.title === "Projects"

                          ? "Projects you own"

                          : item.title === "Recruitments"

                            ? "Active recruitments"

                            : item.title === "Teams"

                              ? "Teams you're involved in"

                              : "Notifications awaiting attention"
                      }

                    </p>

                    <ArrowRight
                      size={18}
                      className="
                    text-slate-600

                    transition

                    group-hover:text-blue-400

                    group-hover:translate-x-1
                "
                    />

                  </div>

                </div>

              </div>

            );

          })}
        </div>

        {/* Activity + Actions */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-[#0B1225] border border-[#1A2745] rounded-2xl p-6">

            <div className="flex items-center justify-between mb-6">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-semibold text-white">

                    Recent Activity

                  </h2>

                  <p className="mt-1 text-sm text-slate-500">

                    Latest updates across your workspace

                  </p>

                </div>



              </div>

              <button
                onClick={() => navigate("/notifications")}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                View All
              </button>

            </div>

            <div className="space-y-5">

              {

                recentNotifications.length === 0 ?

                  (

                    <p className="text-slate-500">

                      No recent activity.

                    </p>

                  )

                  :

                  recentNotifications.map(notification => (

                    <div

                      key={notification._id}

                      onClick={() => navigate("/notifications")}

                      className="
        group

        flex

        gap-4

        rounded-2xl

        border

        border-transparent

        p-4

        cursor-pointer

        transition-all

        duration-300

        hover:bg-slate-800/60

        hover:border-slate-700
    "

                    >

                      <div className="relative">

                        <img

                          src={
                            notification.sender?.avatar ||

                            "/default-avatar.png"
                          }

                          alt={notification.sender?.fullName}

                          className="
                h-12

                w-12

                rounded-full

                object-cover

                border

                border-slate-700
            "

                        />

                        {

                          !notification.isRead && (

                            <span
                              className="
                        absolute

                        -right-1

                        top-0

                        h-3

                        w-3

                        rounded-full

                        bg-blue-500

                        border-2

                        border-slate-900
                    "
                            />

                          )

                        }

                      </div>

                      <div className="flex-1">

                        <div className="flex items-center justify-between">

                          <h3 className="font-medium text-white">

                            {

                              notification.sender?.fullName ||

                              "DevLink"

                            }

                          </h3>

                          <span className="text-xs text-slate-500">

                            {

                              formatDistanceToNow(

                                new Date(notification.createdAt),

                                {

                                  addSuffix: true

                                }

                              )

                            }

                          </span>

                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-400">

                          {notification.message}

                        </p>

                      </div>

                    </div>

                  ))

              }

            </div>

          </div>

          <div className="bg-[#0B1225] border border-[#1A2745] rounded-2xl p-6">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-xl font-semibold text-white">

                Quick Actions

              </h2>



            </div>

            <div className="grid grid-cols-2 gap-4">

              <button

                onClick={() => navigate("/projects/create")}

                className="
                group

                bg-gradient-to-br

                from-blue-600/20

                to-blue-500/5

                border

                border-blue-500/20

                rounded-2xl

                p-5

                text-left

                hover:border-blue-400/50

                hover:-translate-y-1

                transition-all
            "

              >

                <FolderGit2
                  size={28}
                  className="text-blue-400 mb-4"
                />

                <h3 className="text-white font-semibold">

                  Create Project

                </h3>

                <p className="text-slate-400 text-sm mt-1">

                  Start a new development project.

                </p>

              </button>

              <button

                onClick={() => navigate("/recruitments/create")}

                className="
                group

                bg-gradient-to-br

                from-violet-600/20

                to-violet-500/5

                border

                border-violet-500/20

                rounded-2xl

                p-5

                text-left

                hover:border-violet-400/50

                hover:-translate-y-1

                transition-all
            "

              >

                <Briefcase
                  size={28}
                  className="text-violet-400 mb-4"
                />

                <h3 className="text-white font-semibold">

                  Create Recruitment

                </h3>

                <p className="text-slate-400 text-sm mt-1">

                  Hire developers for your project.

                </p>

              </button>

              <button

                onClick={() => navigate("/teams")}

                className="
                group

                bg-gradient-to-br

                from-cyan-600/20

                to-cyan-500/5

                border

                border-cyan-500/20

                rounded-2xl

                p-5

                text-left

                hover:border-cyan-400/50

                hover:-translate-y-1

                transition-all
            "

              >

                <Users
                  size={28}
                  className="text-cyan-400 mb-4"
                />

                <h3 className="text-white font-semibold">

                  Browse Teams

                </h3>

                <p className="text-slate-400 text-sm mt-1">

                  Manage your existing teams.

                </p>

              </button>

              <button

                onClick={() => navigate("/notifications")}

                className="
                group

                bg-gradient-to-br

                from-amber-500/20

                to-amber-500/5

                border

                border-amber-500/20

                rounded-2xl

                p-5

                text-left

                hover:border-amber-400/50

                hover:-translate-y-1

                transition-all
            "

              >

                <Bell
                  size={28}
                  className="text-amber-400 mb-4"
                />

                <h3 className="text-white font-semibold">

                  Notifications

                </h3>

                <p className="text-slate-400 text-sm mt-1">

                  Check your latest updates.

                </p>

              </button>

            </div>

          </div>
        </div>

        {/* Trending */}
        <div className="bg-[#0E162D]/90 backdrop-blur-xl border border-[#1A2745] rounded-3xl p-7">

          <div className="flex items-end justify-between mb-8">

            <div>

              <div className="flex items-center gap-3">

                <TrendingUp
                  size={24}
                  className="text-blue-400"
                />

                <h2 className="text-2xl font-bold text-white">

                  Trending Projects

                </h2>

              </div>

              <p className="mt-2 text-slate-500">

                Most active projects across DevLink.

              </p>

            </div>

            <button

              onClick={() => navigate("/projects")}

              className="
                text-blue-400

                text-sm

                font-medium

                hover:text-blue-300
            "

            >

              Explore All

            </button>

          </div>

          <div className="grid lg:grid-cols-3 gap-5">

            {

              trendingProjects.map(project => (

                <div

                  key={project._id}

                  onClick={() => navigate(`/projects/${project._id}`)}

                  className="
                        group

                        rounded-2xl

                        border

                       border-[#1A2745]

                        bg-slate-800/40

                        p-6

                        cursor-pointer

                        transition-all

                        duration-300

                        hover:border-blue-500/30

                        hover:-translate-y-1
                    "

                >

                  <div className="flex justify-between items-start">

                    <span
                      className="
                                rounded-full

                                bg-blue-500/10

                                px-3

                                py-1

                                text-xs

                                font-medium

                                text-blue-400
                            "
                    >

                      {project.category}

                    </span>

                    <ArrowRight

                      size={18}

                      className="
                                text-slate-600

                                transition

                                group-hover:text-blue-400

                                group-hover:translate-x-1
                            "

                    />

                  </div>

                  <h3
                    className="
                            mt-5

                            text-lg

                            font-semibold

                            text-white

                            transition

                            group-hover:text-blue-400
                        "
                  >

                    {project.title}

                  </h3>

                  <p
                    className="
                            mt-3

                            text-sm

                            leading-6

                            text-slate-400

                            line-clamp-2
                        "
                  >

                    {project.description}

                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">

                    {

                      project.techStack?.slice(0, 3).map(tech => (

                        <span

                          key={tech}

                          className="
                                        rounded-lg

                                        bg-[#0B1225]

                                        px-2.5

                                        py-1

                                        text-xs

                                        text-slate-300
                                    "

                        >

                          {tech}

                        </span>

                      ))

                    }

                  </div>

                  <div
                    className="
                            mt-6

                            flex

                            items-center

                            justify-between

                            border-t

                           border-[#1A2745]

                            pt-4
                        "
                  >

                    <div className="flex gap-5 text-sm">

                      <span className="text-slate-400">

                        ❤️ {project.likesCount}

                      </span>

                      <span className="text-slate-400">

                        💬 {project.commentsCount}

                      </span>

                      <span className="text-slate-400">

                        🔖 {project.bookmarksCount}

                      </span>

                    </div>

                    <span className="text-xs text-emerald-400">

                      Trending

                    </span>

                  </div>

                </div>

              ))

            }

          </div>

        </div>

        {/* Recent Projects */}
        <div className="bg-[#0E162D]/90 backdrop-blur-xl border border-[#1A2745] rounded-3xl p-6">

          <div className="flex items-end justify-between mb-6">

            <div>

              <h2 className="text-xl font-bold text-white">

                Recent Projects

              </h2>

              <p className="mt-1 text-sm text-slate-500">

                Continue where you left off.

              </p>

            </div>

            <button
              onClick={() => navigate("/projects")}
              className="text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              View All
            </button>

          </div>

          <div className="grid lg:grid-cols-2 gap-4">

            {

              recentProjects.map(project => (

                <div

                  key={project._id}

                  onClick={() => navigate(`/projects/${project._id}`)}

                  className="
        group

        rounded-2xl

        border

       border-[#1A2745]

        bg-slate-800/40

        p-6

        cursor-pointer

        transition-all

        duration-300

        hover:border-blue-500/30

        hover:bg-slate-800/70

        hover:-translate-y-1
    "

                >

                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-4">

                      <div
                        className="
                    h-12
                    w-12

                    rounded-xl

                    bg-blue-500/10

                    border

                    border-blue-500/20

                    flex

                    items-center

                    justify-center
                "
                      >

                        <FolderGit2
                          size={22}
                          className="text-blue-400"
                        />

                      </div>

                      <div>

                        <h3
                          className="
                        text-lg

                        font-semibold

                        text-white

                        transition

                        group-hover:text-blue-400
                    "
                        >

                          {project.title}

                        </h3>

                        <span
                          className="
                        inline-block

                        mt-2

                        rounded-full

                        bg-blue-500/10

                        px-3

                        py-1

                        text-xs

                        font-medium

                        text-blue-400
                    "
                        >

                          {project.category}

                        </span>

                      </div>

                    </div>

                    <ArrowRight
                      size={20}
                      className="
                text-slate-600

                transition

                group-hover:text-blue-400

                group-hover:translate-x-1
            "
                    />

                  </div>

                  <p
                    className="
            mt-5

            text-sm

            leading-6

            text-slate-400

            line-clamp-2
        "
                  >

                    {project.description}

                  </p>

                  <div className="flex flex-wrap gap-2 mt-5">

                    {

                      project.techStack?.slice(0, 3).map(tech => (

                        <span

                          key={tech}

                          className="
                        rounded-full

                        bg-[#0B1225]

                        border

                        border-slate-700

                        px-3

                        py-1

                        text-xs

                        font-medium

                        text-slate-300
                    "

                        >

                          {tech}

                        </span>

                      ))

                    }

                  </div>

                  <div
                    className="
            mt-6

            flex

            items-center

            justify-between

            border-t

           border-[#1A2745]

            pt-4
        "
                  >

                    <div className="flex items-center gap-5">

                      <span className="text-sm text-slate-400">

                        ❤️ {project.likesCount}

                      </span>

                      <span className="text-sm text-slate-400">

                        💬 {project.commentsCount}

                      </span>

                      <span className="text-sm text-slate-400">

                        🔖 {project.bookmarksCount}

                      </span>

                    </div>

                    <span
                      className="
                text-sm

                font-medium

                text-blue-400

                group-hover:translate-x-1

                transition
            "
                    >

                      Open →

                    </span>

                  </div>

                </div>

              ))

            }

          </div>

        </div>
      </div>
    </div>

  );
};

export default Dashboard;