import { Outlet } from "react-router-dom";

import Sidebar from "../components/navigation/Sidebar";
import Navbar from "../components/navigation/Navbar";

const ChatLayout = () => {

    return (

        <div
            className="
                h-screen
                flex
                bg-[#020817]
                overflow-hidden
                relative
            "
        >

            <div
                className="
                    absolute
                    -top-40
                    left-1/3
                    h-[520px]
                    w-[520px]
                    rounded-full
                    bg-blue-600/10
                    blur-[160px]
                    pointer-events-none
                "
            />

            <div
                className="
                    absolute
                    -bottom-52
                    right-0
                    h-[500px]
                    w-[500px]
                    rounded-full
                    bg-cyan-500/10
                    blur-[160px]
                    pointer-events-none
                "
            />

            <Sidebar />

            <div
                className="
                    flex-1
                    flex
                    flex-col
                    overflow-hidden
                "
            >

                <Navbar />

                <main
                    className="
                        flex-1
                        overflow-hidden
                        p-6
                    "
                >

                    <Outlet />

                </main>

            </div>

        </div>

    );

};

export default ChatLayout;