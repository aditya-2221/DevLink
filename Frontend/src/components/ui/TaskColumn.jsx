import { useDroppable } from "@dnd-kit/core";

import TaskCard from "../cards/TaskCard";

function TaskColumn({

    id,

    title,

    tasks,

    color,

    onTaskClick

}) {

    const { setNodeRef, isOver } = useDroppable({

        id

    });

    const colors = {

        blue: {

            bg: "bg-blue-500/10",

            text: "text-blue-400",

            border: "border-blue-500/20"

        },

        yellow: {

            bg: "bg-yellow-500/10",

            text: "text-yellow-400",

            border: "border-yellow-500/20"

        },

        green: {

            bg: "bg-green-500/10",

            text: "text-green-400",

            border: "border-green-500/20"

        }

    };

    const theme = colors[color];

    return (

        <div

            ref={setNodeRef}

            className={`
                flex
                flex-col

                rounded-3xl

                backdrop-blur-xl

                border

                p-5

                min-h-[700px]

                transition-all
                duration-300

                ${
                    isOver

                    ?

                    "bg-blue-500/10 border-blue-500"

                    :

                    "bg-slate-900/60 border-white/5"
                }

            `}

        >

            {/* Header */}

            <div className="flex items-center justify-between mb-6">

                <div className="flex items-center gap-3">

                    <div

                        className={`
                            px-4
                            py-2

                            rounded-full

                            border

                            ${theme.bg}
                            ${theme.text}
                            ${theme.border}
                        `}

                    >

                        {title}

                    </div>

                    <span

                        className="
                            text-slate-500
                            text-sm
                        "

                    >

                        {tasks.length} Tasks

                    </span>

                </div>

            </div>

            {/* Cards */}

            <div

                className="
                    flex-1

                    space-y-4

                    overflow-y-auto

                    pr-1
                "

            >

                {

                    tasks.length === 0 ?

                    (

                        <div

                            className="
                                h-48

                                rounded-2xl

                                border-2
                                border-dashed
                                border-slate-700

                                flex
                                flex-col

                                items-center
                                justify-center

                                text-slate-500
                            "

                        >

                            <p className="text-lg">

                                📋

                            </p>

                            <p className="mt-3">

                                No Tasks

                            </p>

                            <p className="text-xs mt-1">

                                Drag a task here

                            </p>

                        </div>

                    )

                    :

                    tasks.map((task,index)=>(

                        <TaskCard

                            key={task._id}

                            task={task}

                            index={index}

                            onClick={onTaskClick}

                        />

                    ))

                }

            </div>

        </div>

    );

}

export default TaskColumn;