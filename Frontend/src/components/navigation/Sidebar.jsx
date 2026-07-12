import {
  Home,
  User,
  FolderGit2,
  Briefcase,
  Users,
  MessageSquare,
  Bell,
  Settings,
} from "lucide-react";
import logo from "../../assets/devlink-logo.png";

import NavItem from "./NavItem";
import { useSelector } from "react-redux";


const Sidebar = () => {
  const { user } = useSelector(
    (state) => state.auth
  )
  return (
    <aside className="
w-64
border-r
border-blue-500/10
bg-[linear-gradient(180deg,#071224_0%,#040b18_100%)]
backdrop-blur-xl
">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="DevLink"
            className="w-15 h-15 drop-shadow-[0_0_12px_rgba(59,130,246,0.7)]"
          />

          <h1 className="text-2xl font-bold text-white">
            DevLink
          </h1>
        </div>
      </div>

      <nav className="flex flex-col gap-3 p-4 mt-4">
        <NavItem
          to="/"
          icon={Home}
          label="Dashboard"
        />

        <NavItem
          to="/profile"
          icon={User}
          label="Profile"
        />

        <NavItem
          to="/projects"
          icon={FolderGit2}
          label="Projects"
        />

        <NavItem
          to="/recruitments"
          icon={Briefcase}
          label="Recruitments"
        />

        <NavItem
          to="/teams"
          icon={Users}
          label="Teams"
        />

        <NavItem
          to="/chats"
          icon={MessageSquare}
          label="Chats"
        />

        <NavItem
          to="/notifications"
          icon={Bell}
          label="Notifications"
        />

        
      </nav>
      <div className="mt-auto border-t border-blue-500/10 p-4">
        <div
          className="
    flex
    items-center
    gap-3
    p-2
    rounded-xl
    hover:bg-slate-800/50
    transition
    cursor-pointer
    "
        >
          <div className="relative">
            <img
              src={user?.avatar}
              alt={user?.fullName}
              className="w-11 h-11 rounded-full object-cover"
            />

            <span
              className="
      absolute
      bottom-0
      right-0
      w-3
      h-3
      rounded-full
      bg-green-500
      border-2
      border-slate-900
      "
            />
          </div>

          <div>
            <h3 className="text-white text-sm font-medium">
              {user?.fullName}
            </h3>

            <p className="text-slate-400 text-xs">
              @{user?.username}
            </p>
          </div>
        </div>
      </div>
    </aside>

  );
};

export default Sidebar;