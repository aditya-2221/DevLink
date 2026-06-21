import { NavLink } from "react-router-dom";

const NavItem = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all
        ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
};

export default NavItem;