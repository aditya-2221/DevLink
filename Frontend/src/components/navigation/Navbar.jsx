import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
const Navbar = () => {
  const { user } = useSelector(
    (state) => state.auth
  )
  return (
    <header className="h-16 border-b border-slate-800 bg-gradient-to-r
from-[#071224]
to-[#0b1730] flex items-center justify-between px-6">
      <div>
        <input
          type="text"
          placeholder="Search projects..."
          className="
            w-[400px]
            bg-slate-900
            border
            border-slate-700
            rounded-xl
            px-4
            py-2
            text-white
            outline-none
          "
        />
      </div>

      <div className="flex items-center gap-5">
        <button>
          <Bell
            size={20}
            className="text-slate-300"
          />
        </button>

        <img
          src={
            user?.avatar ||
            "https://i.pravatar.cc/100"
          }
          alt={user?.fullName}
          className="
      w-10
      h-10
      rounded-full
      object-cover
      border
      border-blue-500/20
      "
        />
      </div>
    </header>
  );
};

export default Navbar;