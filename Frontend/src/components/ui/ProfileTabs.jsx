function ProfileTabs({
  activeTab,
  setActiveTab,
}) {

  return (
    <div
      className="
            flex
            gap-8
            border-b
            border-slate-800
            pb-3
            "
    >

      <button
        onClick={() =>
          setActiveTab(
            "overview"
          )
        }
        className={
          activeTab ===
            "overview"
            ? "text-blue-400 font-medium"
            : "text-slate-400 hover:text-white transition"
        }
      >
        Overview
      </button>

      <button
        onClick={() =>
          setActiveTab(
            "projects"
          )
        }
        className={
          activeTab ===
            "projects"
            ? "text-blue-400 font-medium"
            : "text-slate-400 hover:text-white transition"
        }
      >
        Projects
      </button>

    </div>
  );
}

export default ProfileTabs;