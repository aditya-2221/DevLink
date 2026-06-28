import { X } from "lucide-react";
import { useState } from "react";

import CreateTaskForm from "../forms/CreateTaskForm";
import { createTask } from "../../services/taskService";

function CreateTaskModal({
    open,
    onClose,
    team,
    refreshTasks
}) {

    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleCreateTask = async (data) => {

        try {

            setLoading(true);

            await createTask(data);

            await refreshTasks();

            onClose();

        } catch (error) {

            console.log(error);

            alert(
                error?.response?.data?.message ||
                "Unable to create task."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div
            className="
            fixed
            inset-0

            z-50

            flex
            items-center
            justify-center

            bg-black/70

            backdrop-blur-sm
        "
        >

            <div
                className="
                w-full
                max-w-2xl

                rounded-3xl

                bg-[#111827]

                border
                border-white/10

                shadow-2xl

                p-8

                relative

                animate-in
            "
            >

                {/* Close */}

                <button

                    onClick={onClose}

                    className="
                    absolute

                    right-6
                    top-6

                    w-10
                    h-10

                    rounded-xl

                    hover:bg-slate-800

                    flex
                    items-center
                    justify-center

                    transition
                "
                >

                    <X
                        size={20}
                        className="text-slate-400"
                    />

                </button>

                {/* Heading */}

                <div className="mb-8">

                    <h2
                        className="
                        text-3xl

                        font-bold

                        text-white
                    "
                    >

                        Create New Task

                    </h2>

                    <p
                        className="
                        text-slate-400

                        mt-2
                    "
                    >

                        Assign work to your teammates and keep your project moving.

                    </p>

                </div>

                <CreateTaskForm

                    team={team}

                    loading={loading}

                    onSubmit={handleCreateTask}

                />

            </div>

        </div>

    );

}

export default CreateTaskModal;