import {
    Users,
    FolderPlus,
    UserCircle2,
} from "lucide-react";

const tabs = [
    {
        id: "my",
        label: "My Teams",
        icon: Users,
    },
    {
        id: "create",
        label: "Create Team",
        icon: FolderPlus,
    },
    {
        id: "joined",
        label: "Joined",
        icon: UserCircle2,
    },
];

function TeamTabs({
    activeTab,
    setActiveTab,
}) {

    return (

        <div
            className="
            flex
            flex-wrap
            gap-3
            "
        >

            {tabs.map((tab) => {

                const Icon = tab.icon;

                const active =
                    activeTab === tab.id;

                return (

                    <button
                        key={tab.id}

                        onClick={() =>
                            setActiveTab(tab.id)
                        }

                        className={`
                        
                        relative
                        
                        flex
                        items-center
                        gap-2

                        px-5
                        py-3

                        rounded-xl

                        transition-all
                        duration-300

                        border

                        ${
                            active
                                ? `
                                bg-blue-600
                                border-blue-500
                                text-white

                                shadow-[0_0_20px_rgba(37,99,235,0.30)]
                                `
                                : `
                                bg-slate-900/50
                                border-blue-500/10
                                text-slate-400

                                hover:text-white
                                hover:border-blue-500/30
                                hover:bg-slate-800/70
                                `
                        }
                        `}
                    >

                        <Icon size={18} />

                        <span
                            className="
                            font-medium
                            "
                        >
                            {tab.label}
                        </span>

                    </button>

                );

            })}

        </div>

    );

}

export default TeamTabs;