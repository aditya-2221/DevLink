import {
  MessageCircle,
  Briefcase,
  Users,
  Check,
  X,
  ArrowRight
} from "lucide-react";

import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import chatService from "../../services/chatService";

import {
  getMyRecruitments
} from "../../services/recruitmentService";
import { getMyTeams } from "../../services/teamService";

const RightSidebar = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [pendingRequests, setPendingRequests] = useState([]);

  const [recruitments, setRecruitments] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {

    loadSidebar();

  }, []);

  const loadSidebar = async () => {

    try {

      setLoading(true);

      const [

        pendingRes,

        recruitmentRes,

        teamRes

      ] = await Promise.all([

        chatService.getPendingRequests(),

        getMyRecruitments({
          page: 1,
          limit: 3
        }),

        getMyTeams()

      ]);

      setPendingRequests(

        pendingRes.requests || []

      );

      setRecruitments(

        recruitmentRes.data.data.recruitments || []

      );
      setTeams(

        teamRes.data.data || []

      );

    }

    catch (err) {

      console.log(err);

    }

    finally {

      setLoading(false);

    }

  };

  const handleAccept = async (id) => {

    try {

      await chatService.acceptChatRequest(id);

      loadSidebar();

    }

    catch (err) {

      console.log(err);

    }

  };

  const handleReject = async (id) => {

    try {

      await chatService.rejectChatRequest(id);

      loadSidebar();

    }

    catch (err) {

      console.log(err);

    }

  };

  return (

    <aside
      className="
        hidden
        xl:block

        w-80

        overflow-y-auto

        border-l

        border-[#1A2745]

        bg-[#08101F]/90

        backdrop-blur-xl

        p-5

        space-y-5
    "
    >

      {/* Pending Chat Requests */}

      <section
        className="
            rounded-2xl

            border

            border-[#1A2745]

            bg-[#0E162D]/90

            p-5
        "
      >

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <MessageCircle
              size={18}
              className="text-blue-400"
            />

            <h2 className="font-semibold text-white">

              Chat Requests

            </h2>

          </div>

          <button

            onClick={() => navigate("/chats")}

            className="
                    text-xs

                    text-blue-400

                    hover:text-blue-300
                "

          >

            View All

          </button>

        </div>

        <div className="mt-5 space-y-4">

          {

            loading ?

              (

                <p className="text-sm text-slate-500">

                  Loading...

                </p>

              )

              :

              pendingRequests.length === 0 ?

                (

                  <p className="text-sm text-slate-500">

                    No pending requests

                  </p>

                )

                :

                pendingRequests.slice(0, 2).map(request => (

                  <div

                    key={request._id}

                    className="
                                    rounded-xl

                                    border

                                    border-slate-700

                                    bg-slate-800/30

                                    p-3
                                "

                  >

                    <div className="flex gap-3">

                      <img

                        src={request.sender.avatar}

                        alt=""

                        className="
                                            h-11

                                            w-11

                                            rounded-full

                                            object-cover
                                        "

                      />

                      <div className="flex-1">

                        <h3 className="font-medium text-white">

                          {request.sender.fullName}

                        </h3>

                        <p className="text-xs text-slate-400 mt-1">

                          {request.message}

                        </p>

                      </div>

                    </div>

                    <div className="flex gap-2 mt-4">

                      <button

                        onClick={() => handleAccept(request._id)}

                        className="
                                            flex-1

                                            rounded-lg

                                            bg-blue-600

                                            py-2

                                            text-sm

                                            text-white

                                            hover:bg-blue-500
                                        "

                      >

                        <Check size={16} className="mx-auto" />

                      </button>

                      <button

                        onClick={() => handleReject(request._id)}

                        className="
                                            flex-1

                                            rounded-lg

                                            bg-slate-700

                                            py-2

                                            text-sm

                                            text-white

                                            hover:bg-slate-600
                                        "

                      >

                        <X size={16} className="mx-auto" />

                      </button>

                    </div>

                  </div>

                ))

          }

        </div>

      </section>

      {/* My Recruitments */}

      <section
        className="
            rounded-2xl

            border

            border-[#1A2745]

            bg-[#0E162D]/90

            p-5
        "
      >

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <Briefcase
              size={18}
              className="text-violet-400"
            />

            <h2 className="font-semibold text-white">

              My Recruitments

            </h2>

          </div>

          <button

            onClick={() => navigate("/recruitments")}

            className="
                    text-xs

                    text-violet-400

                    hover:text-violet-300
                "

          >

            View All

          </button>

        </div>

        <div className="mt-5 space-y-3">

          {

            recruitments.length === 0 ?

              (

                <p className="text-sm text-slate-500">

                  No active recruitments

                </p>

              )

              :

              recruitments.map(recruitment => (

                <div

                  key={recruitment._id}

                  onClick={() => navigate(`/recruitments/${recruitment._id}`)}

                  className="
                                cursor-pointer

                                rounded-xl

                                border

                                border-slate-700

                                bg-slate-800/30

                                p-4

                                transition

                                hover:border-violet-500/40
                            "

                >

                  <div className="flex justify-between">

                    <div>

                      <h3 className="font-medium text-white">

                        {recruitment.title}

                      </h3>

                      <div className="mt-2 flex items-center justify-between text-xs">

                        <span className="text-slate-400">
                          {recruitment.applicantsCount} Applicants
                        </span>

                        <span
                          className={
                            recruitment.status === "OPEN"
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }
                        >
                          {recruitment.status}
                        </span>

                      </div>

                      <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">

                        <div
                          className="h-full bg-violet-500"
                          style={{
                            width: `${(recruitment.acceptedCount / recruitment.positions) * 100}%`
                          }}
                        />

                      </div>

                      <p className="mt-2 text-xs text-slate-500">
                        {recruitment.acceptedCount} of {recruitment.positions} positions filled
                      </p>
                    </div>

                    <ArrowRight
                      size={16}
                      className="text-slate-500"
                    />

                  </div>

                </div>

              ))

          }

        </div>

      </section>
      {/* My Teams */}

      <section
        className="
            rounded-2xl
            border
            border-[#1A2745]
            bg-[#0E162D]/90
            p-5
        "
      >

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <Users
              size={18}
              className="text-emerald-400"
            />

            <h2 className="font-semibold text-white">

              My Teams

            </h2>

          </div>

          <button

            onClick={() => navigate("/teams")}

            className="
                    text-xs
                    text-emerald-400
                    hover:text-emerald-300
                "

          >

            View All

          </button>

        </div>

        <div className="mt-5 space-y-3">

          {

            teams.length === 0 ?

              (

                <p className="text-sm text-slate-500">

                  You are not part of any team.

                </p>

              )

              :

              teams.slice(0, 3).map(team => (

                <div

                  key={team._id}

                  onClick={() => navigate(`/teams/${team._id}`)}

                  className="
                                group

                                cursor-pointer

                                rounded-xl

                                border

                                border-slate-700

                                bg-slate-800/30

                                p-4

                                transition-all

                                duration-300

                                hover:border-emerald-500/40

                                hover:bg-slate-800/50
                            "

                >

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="font-medium text-white">

                        {team.name}

                      </h3>

                      <p className="mt-1 text-xs text-slate-400">

                        {team.members?.length || 0} Members

                      </p>

                    </div>

                    <ArrowRight
                      size={16}
                      className="
                                        text-slate-500

                                        transition

                                        group-hover:text-emerald-400

                                        group-hover:translate-x-1
                                    "
                    />

                  </div>

                </div>

              ))

          }

        </div>

      </section>



    </aside>

  );

};

export default RightSidebar;
