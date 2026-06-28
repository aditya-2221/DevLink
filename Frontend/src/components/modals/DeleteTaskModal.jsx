import { AlertTriangle, Loader2 } from "lucide-react";

function DeleteTaskModal({

    open,

    loading,

    task,

    onClose,

    onDelete

}) {

    if (!open) return null;

    return (

        <>

            {/* Overlay */}

            <div

                onClick={onClose}

                className="
                fixed
                inset-0

                bg-black/60

                backdrop-blur-sm

                z-50
            "

            />

            {/* Modal */}

            <div

                className="
                fixed

                left-1/2
                top-1/2

                -translate-x-1/2
                -translate-y-1/2

                w-[430px]

                rounded-3xl

                bg-[#162238]

                border
                border-red-500/10

                shadow-2xl
                shadow-red-500/10

                z-[60]

                p-8
            "

            >

                <div className="flex justify-center">

                    <div

                        className="
                        h-16
                        w-16

                        rounded-full

                        bg-red-500/10

                        flex
                        items-center
                        justify-center
                    "

                    >

                        <AlertTriangle

                            size={30}

                            className="text-red-400"

                        />

                    </div>

                </div>

                <h2

                    className="
                    mt-6

                    text-center

                    text-2xl

                    font-bold

                    text-white
                "

                >

                    Delete Task?

                </h2>

                <p

                    className="
                    mt-3

                    text-center

                    text-slate-400
                "

                >

                    You are about to delete

                </p>

                <p

                    className="
                    mt-2

                    text-center

                    font-semibold

                    text-cyan-300
                "

                >

                    {task?.title}

                </p>

                <p

                    className="
                    mt-6

                    text-center

                    text-sm

                    text-slate-500
                "

                >

                    This action cannot be undone.

                </p>

                <div

                    className="
                    mt-8

                    flex
                    gap-4
                "

                >

                    <button

                        onClick={onClose}

                        disabled={loading}

                        className="
                        flex-1

                        rounded-xl

                        border
                        border-slate-700

                        py-3

                        text-white

                        hover:bg-slate-800

                        transition
                    "

                    >

                        Cancel

                    </button>

                    <button

                        onClick={onDelete}

                        disabled={loading}

                        className="
                        flex-1

                        rounded-xl

                        bg-red-500

                        py-3

                        font-semibold

                        text-white

                        hover:bg-red-600

                        transition

                        flex
                        items-center
                        justify-center
                        gap-2
                    "

                    >

                        {

                            loading

                                ?

                                <>

                                    <Loader2

                                        size={18}

                                        className="animate-spin"

                                    />

                                    Deleting...

                                </>

                                :

                                "Delete"

                        }

                    </button>

                </div>

            </div>

        </>

    );

}

export default DeleteTaskModal;