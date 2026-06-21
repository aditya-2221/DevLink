import React from "react";
import { Outlet } from "react-router-dom";
import AuthLeftPanel from "../components/ui/AuthLeftPanel";

const AuthLayout = () => {
  return (
    <div className="h-screen overflow-hidden bg-[#030712] relative text-white">

      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 blur-[180px]" />
      </div>

      <div className="relative h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-[1550px] h-[92vh] rounded-[28px] border border-white/10 bg-[#050b1f]/90 backdrop-blur-xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)]">

          <div className="grid lg:grid-cols-[45%_55%] h-full">

            <AuthLeftPanel />

            <div className="flex items-center justify-center p-6 lg:p-8">
              <div className="w-full max-w-[650px]">
                <Outlet />
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default AuthLayout;