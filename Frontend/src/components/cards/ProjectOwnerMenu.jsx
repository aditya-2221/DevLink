import { useEffect, useRef, useState } from "react";
import {
    FaEllipsisV,
    FaEdit,
    FaTrash
} from "react-icons/fa";

function ProjectOwnerMenu({
    onEdit,
    onDelete
}) {

    const [open, setOpen] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setOpen(false);
            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

    }, []);

    return (

        <div
            ref={menuRef}
            className="relative"
        >

            <button
                onClick={() =>
                    setOpen(!open)
                }
                className="
                w-11
                h-11
                rounded-xl
                bg-slate-800
                hover:bg-slate-700
                flex
                items-center
                justify-center
                text-slate-300
                transition
                "
            >
                <FaEllipsisV />
            </button>

            {open && (

                <div
                    className="
                    absolute
                    right-0
                    mt-2
                    w-56
                    rounded-2xl
                    border
                    border-slate-700
                    bg-slate-900
                    shadow-2xl
                    overflow-hidden
                    z-50
                    animate-in
                    fade-in
                    zoom-in-95
                    duration-150
                    "
                >

                    <button
                        onClick={() => {

                            setOpen(false);

                            onEdit();

                        }}
                        className="
                        w-full
                        px-5
                        py-4
                        flex
                        items-center
                        gap-3
                        text-slate-200
                        hover:bg-slate-800
                        transition
                        "
                    >

                        <FaEdit />

                        Edit Project

                    </button>

                    <div className="border-t border-slate-700" />

                    <button
                        onClick={() => {

                            setOpen(false);

                            onDelete();

                        }}
                        className="
                        w-full
                        px-5
                        py-4
                        flex
                        items-center
                        gap-3
                        text-red-400
                        hover:bg-red-500/10
                        transition
                        "
                    >

                        <FaTrash />

                        Delete Project

                    </button>

                </div>

            )}

        </div>

    );

}

export default ProjectOwnerMenu;