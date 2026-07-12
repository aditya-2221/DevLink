import {
    Bell,
    User,
    Shield,
    LogOut,
    ChevronDown
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState
} from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import SearchBar from "../search/SearchBar";

import {
    fetchNotifications
} from "../../features/notifications/notificationSlice";

const Navbar = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const logout = useLogout();

    const { user } = useSelector(
        state => state.auth
    );

    const {
        unreadCount
    } = useSelector(
        state => state.notification
    );

    const [showMenu, setShowMenu] =
        useState(false);

    const menuRef = useRef(null);

    useEffect(() => {

        dispatch(
            fetchNotifications()
        );

    }, [dispatch]);

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (

                menuRef.current &&

                !menuRef.current.contains(
                    event.target
                )

            ) {

                setShowMenu(false);

            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);

    return (

        <header
            className="
            h-16

            border-b
            border-slate-800

            bg-gradient-to-r
            from-[#071224]
            to-[#0b1730]

            flex
            items-center
            justify-between

            px-6
            "
        >

            <SearchBar />

            <div className="flex items-center gap-5">

                <button

                    onClick={() =>
                        navigate("/notifications")
                    }

                    className="
                    relative

                    p-2

                    rounded-xl

                    hover:bg-slate-800

                    transition
                    "

                >

                    <Bell
                        size={20}
                        className="text-slate-300"
                    />

                    {

                        unreadCount > 0 && (

                            <span
                                className="
                                absolute

                                -top-1
                                -right-1

                                min-w-[18px]
                                h-[18px]

                                rounded-full

                                bg-red-500

                                text-white

                                text-[10px]
                                font-semibold

                                flex
                                items-center
                                justify-center

                                px-1
                                "
                            >

                                {

                                    unreadCount > 99

                                        ?

                                        "99+"

                                        :

                                        unreadCount

                                }

                            </span>

                        )

                    }

                </button>

                <div
                    className="relative"
                    ref={menuRef}
                >

                    <button

                        onClick={() =>
                            setShowMenu(
                                prev => !prev
                            )
                        }

                        className="
                        flex
                        items-center
                        gap-2

                        rounded-full

                        hover:bg-slate-800

                        p-1

                        transition
                        "

                    >

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

                            border-blue-500/30
                            "

                        />

                        <ChevronDown

                            size={16}

                            className={`
                                text-slate-400
                                transition-transform

                                ${showMenu

                                    ?

                                    "rotate-180"

                                    :

                                    ""

                                }
                            `}

                        />

                    </button>
                    {

                        showMenu && (

                            <div
                                className="
                                absolute

                                right-0
                                top-full

                                mt-3

                                w-72

                                rounded-2xl

                                border
                                border-slate-700

                                bg-[#0F172A]/95

                                backdrop-blur-xl

                                shadow-[0_15px_40px_rgba(0,0,0,0.45)]

                                overflow-hidden

                                z-50

                                animate-in

                                fade-in

                                slide-in-from-top-2
                                "
                            >

                                {/* User Info */}

                                <div
                                    className="
                                    px-5
                                    py-4

                                    border-b
                                    border-slate-800

                                    flex
                                    items-center
                                    gap-4
                                    "
                                >

                                    <img

                                        src={
                                            user?.avatar ||
                                            "https://i.pravatar.cc/100"
                                        }

                                        alt={user?.fullName}

                                        className="
                                        w-14
                                        h-14

                                        rounded-full

                                        object-cover

                                        border-2

                                        border-cyan-500/30
                                        "
                                    />

                                    <div>

                                        <h3
                                            className="
                                            text-white

                                            font-semibold
                                            "
                                        >

                                            {user?.fullName}

                                        </h3>

                                        <p
                                            className="
                                            text-slate-400

                                            text-sm
                                            "
                                        >

                                            @{user?.username}

                                        </p>

                                    </div>

                                </div>

                                {/* My Profile */}

                                <button

                                    onClick={() => {

                                        setShowMenu(false);

                                        navigate(
                                            `/profile/${user?.username}`
                                        );

                                    }}

                                    className="
                                    w-full

                                    flex
                                    items-center

                                    gap-3

                                    px-5
                                    py-3

                                    text-slate-300

                                    hover:bg-slate-800

                                    transition
                                    "

                                >

                                    <User size={18} />

                                    <span>

                                        My Profile

                                    </span>

                                </button>

                                {/* Security */}

                                <button

                                    onClick={() => {

                                        setShowMenu(false);

                                        navigate(
                                            "/security"
                                        );

                                    }}

                                    className="
                                    w-full

                                    flex
                                    items-center

                                    gap-3

                                    px-5
                                    py-3

                                    text-slate-300

                                    hover:bg-slate-800

                                    transition
                                    "

                                >

                                    <Shield size={18} />

                                    <span>

                                        Security

                                    </span>

                                </button>

                                <div className="border-t border-slate-800" />

                                {/* Logout */}

                                <button

                                    onClick={async () => {

                                        setShowMenu(false);

                                        await logout();

                                    }}

                                    className="
                                    w-full

                                    flex
                                    items-center

                                    gap-3

                                    px-5
                                    py-3

                                    text-red-400

                                    hover:bg-red-500/10

                                    transition
                                    "

                                >

                                    <LogOut size={18} />

                                    <span>

                                        Logout

                                    </span>

                                </button>

                            </div>

                        )

                    }

                </div>

            </div>

        </header>

    );

};

export default Navbar;