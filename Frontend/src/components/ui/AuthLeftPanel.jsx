import React from "react";
import logo from "../../assets/devlink-logo.png";


const AuthLeftPanel = () => {
  const features = [
    {
      icon: (
        <svg
          className="w-4 h-4 text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Collaborate in Teams",
      desc: "Work together on projects in real time.",
    },
    {
      icon: (
        <svg
          className="w-4 h-4 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Showcase Your Work",
      desc: "Build your profile and highlight projects.",
    },
    {
      icon: (
        <svg
          className="w-4 h-4 text-indigo-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002 2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Find Opportunities",
      desc: "Discover jobs and open-source roles.",
    },
    {
      icon: (
        <svg
          className="w-4 h-4 text-sky-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      title: "Communicate Seamlessly",
      desc: "Chat, share ideas and build together.",
    },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between h-full px-10 py-8 bg-[#050B1F] relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute -left-32 bottom-0 w-[400px] h-[400px] bg-blue-600/20 blur-[160px] rounded-full" />
      <div className="absolute left-0 bottom-0 w-[300px] h-[300px] bg-purple-600/20 blur-[140px] rounded-full" />

      {/* Dot Grid */}
      <div className="absolute top-10 right-12 grid grid-cols-4 gap-3 opacity-30">
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className="w-1 h-1 bg-blue-400 rounded-full"
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">

        <div className="flex items-center gap-2 mb-8">
          <img
            src={logo}
            alt="DevLink"
            className="w-30 h-30 object-contain"
          />

          <h2 className="text-[52px] font-bold leading-none tracking-tight">
            Dev<span className="text-blue-500">Link</span>
          </h2>
        </div>


        {/* Heading */}
        <h1 className="text-[42px] leading-tight font-bold text-white">
          Connect. Collaborate.
        </h1>

        <h2 className="text-[42px] leading-tight font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mt-1">
          Build the Future.
        </h2>

        {/* Description */}
        <p className="mt-6 text-gray-400 text-base leading-relaxed max-w-md">
          Join a community of developers, build amazing projects,
          discover opportunities, and grow together.
        </p>

        {/* Features */}
        <div className="mt-8 space-y-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3"
            >
              <div className="w-15 h-15 rounded-xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                {feature.icon}
              </div>

              <div>
                <h3 className="text-m font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Developer Illustration */}
      <div className="relative flex-1 flex items-end justify-center mt-2">

        {/* Glow Behind Image */}
        <div className="absolute bottom-0 w-[450px] h-[180px] bg-blue-600/10 blur-[120px] rounded-full" />


      </div>
    </div>
  );
};

export default AuthLeftPanel;