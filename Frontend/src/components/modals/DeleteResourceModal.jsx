import { Trash2, X } from "lucide-react";

function DeleteResourceModal({

    open,

    resource,

    deleting,

    onClose,

    onDelete

}) {

    if (!open) return null;

    return (
        <>
            <div
                onClick={onClose}
                className="
                fixed inset-0
                bg-black/70
                backdrop-blur-sm
                z-40
                "
            />

            <div
                className="
                fixed

                left-1/2
                top-1/2

                -translate-x-1/2
                -translate-y-1/2

                w-[430px]

                rounded-3xl

                bg-[#111827]

                border
                border-red-500/20

                z-50

                p-8
                "
            >

                <div className="flex justify-between">

                    <div>

                        <h2 className="text-2xl text-white font-bold">

                            Delete Resource

                        </h2>

                        <p className="mt-3 text-slate-400">

                            This action cannot be undone.

                        </p>

                    </div>

                    <button onClick={onClose}>

                        <X className="text-slate-400" />

                    </button>

                </div>

                <div
                    className="
                    mt-8

                    rounded-2xl

                    bg-slate-900

                    p-5
                    "
                >

                    <p className="text-white">

                        {resource?.fileName}

                    </p>

                </div>

                <div className="flex justify-end gap-4 mt-8">

                    <button

                        onClick={onClose}

                        className="
                        px-5 py-3

                        rounded-xl

                        bg-slate-700

                        text-white
                        "

                    >

                        Cancel

                    </button>

                    <button

                        disabled={deleting}

                        onClick={onDelete}

                        className="
                        flex
                        items-center
                        gap-2

                        px-5
                        py-3

                        rounded-xl

                        bg-red-600

                        text-white
                        "

                    >

                        <Trash2 size={18} />

                        Delete

                    </button>

                </div>

            </div>

        </>
    );

}

export default DeleteResourceModal;