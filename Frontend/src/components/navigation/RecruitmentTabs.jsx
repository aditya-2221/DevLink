function RecruitmentTabs({
  activeTab,
  setActiveTab,
}) {
  const tabs = [
    {
      id: "all",
      label: "Browse Recruitments",
    },
    {
      id: "create",
      label: "Create Recruitment",
    },
    {
      id: "my",
      label: "My Recruitments",
    },
    {
      id: "applied",
      label: "Applied Recruitments",
    },
  ];

  return (
    <div
      className="
      bg-slate-900/40
      border
      border-blue-500/10
      rounded-xl
      p-2
      flex
      flex-wrap
      gap-2
      "
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() =>
            setActiveTab(tab.id)
          }
          className={`
          px-5
          py-2.5
          rounded-lg
          transition-all

          ${
            activeTab === tab.id
              ? `
                bg-blue-600
                text-white
                shadow-[0_0_20px_rgba(37,99,235,0.35)]
              `
              : `
                text-slate-400
                hover:text-white
                hover:bg-slate-800
              `
          }
        `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default RecruitmentTabs;