import {
    DndContext,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import {
    SortableContext,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { Plus, Search } from "lucide-react";

import TaskColumn from "./TaskColumn";
import { moveTask } from "../../services/taskService";

function TaskBoard({

    tasks,

    refreshTasks,

    onAddTask,

    onTaskClick

}) {

    const sensors = useSensors(

        useSensor(PointerSensor, {

            activationConstraint: {

                distance: 8

            }

        })

    );

    const handleDragEnd = async(event)=>{

        const {active,over}=event;

        if(!over) return;

        const taskId=active.id;

        const newStatus=over.id;

        const task=[

            ...tasks.todo,

            ...tasks.inProgress,

            ...tasks.done

        ].find(t=>t._id===taskId);

        if(!task) return;

        const statusMap={

            TODO:"TODO",

            IN_PROGRESS:"IN_PROGRESS",

            DONE:"DONE"

        };

        if(task.status===statusMap[newStatus]) return;

        try{

            await moveTask(

                taskId,

                statusMap[newStatus]

            );

            await refreshTasks();

        }

        catch(err){

            console.log(err);

        }

    }

    return(

        <div className="space-y-8">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Tasks

                    </h2>

                    <p className="text-slate-400 mt-2">

                        Organize and track your team's work.

                    </p>

                </div>

                <button

                    onClick={onAddTask}

                    className="
                    flex
                    items-center
                    gap-2

                    rounded-xl

                    px-5
                    py-3

                    bg-gradient-to-r
                    from-blue-600
                    to-cyan-500

                    hover:scale-105

                    transition-all

                    text-white
                    "

                >

                    <Plus size={18}/>

                    New Task

                </button>

            </div>

            {/* Toolbar */}

            <div className="flex gap-4 flex-wrap">

                <div

                    className="
                    flex-1

                    flex
                    items-center
                    gap-3

                    rounded-xl

                    bg-slate-900

                    border
                    border-white/5

                    px-4
                    py-3
                    "

                >

                    <Search

                        size={18}

                        className="text-slate-500"

                    />

                    <input

                        placeholder="Search tasks..."

                        className="
                        flex-1

                        bg-transparent

                        outline-none

                        text-white

                        placeholder:text-slate-500
                        "

                    />

                </div>

            </div>

            <DndContext

                sensors={sensors}

                collisionDetection={closestCorners}

                onDragEnd={handleDragEnd}

            >

                <div className="grid lg:grid-cols-3 gap-6">

                    <SortableContext

                        items={tasks.todo.map(task=>task._id)}

                        strategy={verticalListSortingStrategy}

                    >

                        <TaskColumn

                            id="TODO"

                            title="To Do"

                            color="blue"

                            tasks={tasks.todo}

                            onTaskClick={onTaskClick}

                        />

                    </SortableContext>

                    <SortableContext

                        items={tasks.inProgress.map(task=>task._id)}

                        strategy={verticalListSortingStrategy}

                    >

                        <TaskColumn

                            id="IN_PROGRESS"

                            title="In Progress"

                            color="yellow"

                            tasks={tasks.inProgress}

                            onTaskClick={onTaskClick}

                        />

                    </SortableContext>

                    <SortableContext

                        items={tasks.done.map(task=>task._id)}

                        strategy={verticalListSortingStrategy}

                    >

                        <TaskColumn

                            id="DONE"

                            title="Done"

                            color="green"

                            tasks={tasks.done}

                            onTaskClick={onTaskClick}

                        />

                    </SortableContext>

                </div>

            </DndContext>

        </div>

    );

}

export default TaskBoard;