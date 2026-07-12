import { useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

function TeamOwnerMenu({
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
                p-3

                rounded-xl

                bg-slate-900/70

                hover:bg-slate-800

                border
                border-blue-500/10

                transition
                "
            >

                <MoreVertical
                    className="text-white"
                    size={20}
                />

            </button>

            {open && (

                <div
                    className="
                    absolute

                    right-0
                    mt-3

                    w-48

                    rounded-2xl

                    bg-slate-900

                    border
                    border-blue-500/10

                    shadow-2xl

                    overflow-hidden

                    z-50
                    "
                >

                    <button
                        onClick={() => {

                            setOpen(false);

                            onEdit();

                        }}
                        className="
                        w-full

                        flex
                        items-center
                        gap-3

                        px-5
                        py-4

                        text-slate-300

                        hover:bg-slate-800

                        transition
                        "
                    >

                        <Pencil size={18} />

                        Edit Team

                    </button>

                    <button
                        onClick={() => {

                            setOpen(false);

                            onDelete();

                        }}
                        className="
                        w-full

                        flex
                        items-center
                        gap-3

                        px-5
                        py-4

                        text-red-400

                        hover:bg-red-500/10

                        transition
                        "
                    >

                        <Trash2 size={18} />

                        Delete Team

                    </button>

                </div>

            )}

        </div>

    );

}

export default TeamOwnerMenu;