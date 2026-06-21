import {
  Bell,
  Clock3,
  Users,
} from "lucide-react";

const RightSidebar = () => {
  return (
    <aside
      className="
      w-80
      border-l
      border-blue-500/10
      bg-slate-950/40
      backdrop-blur-xl
      p-5
      overflow-y-auto
      hidden
      xl:block
      "
    >
      {/* Deadlines */}

      <div
        className="
        bg-slate-900/50
        rounded-xl
        border
        border-blue-500/10
        p-4
        mb-5
        "
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock3
            size={18}
            className="text-yellow-400"
          />

          <h2 className="font-semibold text-white">
            Upcoming Deadlines
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-white text-sm">
              Team Meeting
            </p>

            <p className="text-slate-400 text-xs">
              Today • 7 PM
            </p>
          </div>

          <div>
            <p className="text-white text-sm">
              Project Review
            </p>

            <p className="text-slate-400 text-xs">
              Tomorrow
            </p>
          </div>

          <div>
            <p className="text-white text-sm">
              Design Submission
            </p>

            <p className="text-slate-400 text-xs">
              May 22
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}

      <div
        className="
        bg-slate-900/50
        rounded-xl
        border
        border-blue-500/10
        p-4
        mb-5
        "
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell
            size={18}
            className="text-blue-400"
          />

          <h2 className="font-semibold text-white">
            Notifications
          </h2>
        </div>

        <div className="space-y-3">
          <p className="text-slate-300 text-sm">
            Rahul liked your project.
          </p>

          <p className="text-slate-300 text-sm">
            New recruitment application.
          </p>

          <p className="text-slate-300 text-sm">
            Team invite pending.
          </p>
        </div>
      </div>

      {/* Online */}

      <div
        className="
        bg-slate-900/50
        rounded-xl
        border
        border-blue-500/10
        p-4
        "
      >
        <div className="flex items-center gap-2 mb-4">
          <Users
            size={18}
            className="text-green-400"
          />

          <h2 className="font-semibold text-white">
            Online Members
          </h2>
        </div>

        <div className="space-y-3">
          {["Rahul", "Priya", "Aman", "Neha"].map(
            (user) => (
              <div
                key={user}
                className="flex justify-between"
              >
                <span className="text-slate-300 text-sm">
                  {user}
                </span>

                <span
                  className="
                  w-2
                  h-2
                  rounded-full
                  bg-green-500
                  mt-2
                  "
                />
              </div>
            )
          )}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;