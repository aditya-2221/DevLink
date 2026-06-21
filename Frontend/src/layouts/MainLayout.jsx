import { Outlet } from "react-router-dom";

import Sidebar from "../components/navigation/Sidebar";
import Navbar from "../components/navigation/Navbar";
import RightSidebar from "../components/navigation/RightSidebar";

const MainLayout = () => {
  return (
    <div className="h-screen flex bg-[#020817] relative overflow-hidden">

      <div
        className="
      absolute
      top-[-200px]
      left-[20%]
      h-[500px]
      w-[500px]
      rounded-full
      bg-blue-600/10
      blur-[150px]
      pointer-events-none
      "
      />

      <div
        className="
      absolute
      bottom-[-200px]
      right-[10%]
      h-[500px]
      w-[500px]
      rounded-full
      bg-cyan-500/10
      blur-[150px]
      pointer-events-none
      "
      />
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex flex-1 overflow-hidden">

          <main
            className="
      flex-1
      overflow-y-auto
      p-8
      bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.12),_transparent_40%)]
      "
          >
            <div className="max-w-[1400px] mx-auto">
              <Outlet />
            </div>
          </main>

          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;