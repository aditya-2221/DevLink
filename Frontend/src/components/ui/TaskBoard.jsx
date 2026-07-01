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
import { useMemo, useState } from "react";



function TaskBoard({

    tasks,

    refreshTasks,

    onAddTask,

    onTaskClick

}) {

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");

    const [priorityFilter, setPriorityFilter] = useState("ALL");

    const [assigneeFilter, setAssigneeFilter] = useState("ALL");

    const [sortBy, setSortBy] = useState("latest");
    const assignees = useMemo(() => {

        const members = [];

        const seen = new Set();

        [
            ...tasks.todo,
            ...tasks.inProgress,
            ...tasks.done
        ].forEach(task => {

            if (
                task.assignedTo &&
                !seen.has(task.assignedTo._id)
            ) {

                seen.add(task.assignedTo._id);

                members.push(task.assignedTo);

            }

        });

        return members;

    }, [tasks]);

    const filteredTasks = useMemo(() => {



        const filterAndSort = (taskList) => {

            let filtered = [...taskList];

            // Search
            if (search.trim()) {

                const query = search.toLowerCase();

                filtered = filtered.filter(task =>

                    task.title.toLowerCase().includes(query) ||

                    task.description?.toLowerCase().includes(query)

                );

            }

            // Priority Filter
            if (priorityFilter !== "ALL") {

                filtered = filtered.filter(

                    task => task.priority === priorityFilter

                );

            }
            // Assignee Filter

            if (assigneeFilter !== "ALL") {

                filtered = filtered.filter(

                    task =>

                        task.assignedTo?._id === assigneeFilter

                );

            }
            // Sorting
            filtered.sort((a, b) => {

                switch (sortBy) {

                    case "oldest":

                        return new Date(a.createdAt) - new Date(b.createdAt);

                    case "priority": {

                        const priorityOrder = {

                            LOW: 1,

                            MEDIUM: 2,

                            HIGH: 3,

                            URGENT: 4

                        };

                        return priorityOrder[b.priority] - priorityOrder[a.priority];
                    }

                    case "dueDate":

                        return new Date(a.dueDate) - new Date(b.dueDate);

                    default:

                        return new Date(b.createdAt) - new Date(a.createdAt);

                }

            });

            return filtered;

        };


        return {

            todo: filterAndSort(tasks.todo),

            inProgress: filterAndSort(tasks.inProgress),

            done: filterAndSort(tasks.done)

        };

    }, [

        tasks,

        search,

        priorityFilter,

        assigneeFilter,

        sortBy

    ]);

    const sensors = useSensors(

        useSensor(PointerSensor, {

            activationConstraint: {

                distance: 8

            }

        })

    );

    const handleDragEnd = async (event) => {

        const { active, over } = event;

        if (!over) return;

        const taskId = active.id;

        const newStatus = over.id;

        const task = [

            ...tasks.todo,

            ...tasks.inProgress,

            ...tasks.done

        ].find(t => t._id === taskId);

        if (!task) return;

        const statusMap = {

            TODO: "TODO",

            IN_PROGRESS: "IN_PROGRESS",

            DONE: "DONE"

        };

        if (task.status === statusMap[newStatus]) return;

        try {

            await moveTask(

                taskId,

                statusMap[newStatus]

            );

            await refreshTasks();

        }

        catch (err) {

            console.log(err);

        }

    }

    return (

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

                    <Plus size={18} />

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

                        value={search}

                        onChange={(e) =>

                            setSearch(e.target.value)

                        }

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

                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="
        rounded-xl
        bg-slate-900
        border
        border-white/5
        px-4
        py-3
        text-white
    "
                >
                    <option value="ALL">All Priorities</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>

                </select>

                <select
                    value={assigneeFilter}
                    onChange={(e) => setAssigneeFilter(e.target.value)}
                    className="
        rounded-xl
        bg-slate-900
        border
        border-white/5
        px-4
        py-3
        text-white
    "
                >
                    <option value="ALL">
                        All Members
                    </option>

                    {assignees.map(member => (

                        <option
                            key={member._id}
                            value={member._id}
                        >
                            {member.fullName}
                        </option>

                    ))}
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="
        rounded-xl
        bg-slate-900
        border
        border-white/5
        px-4
        py-3
        text-white
    "
                >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="priority">Priority</option>
                    <option value="dueDate">Due Date</option>
                </select>

            </div>

            <DndContext

                sensors={sensors}

                collisionDetection={closestCorners}

                onDragEnd={handleDragEnd}

            >

                <div className="grid lg:grid-cols-3 gap-6">

                    <SortableContext

                        items={filteredTasks.todo.map(task => task._id)}

                        strategy={verticalListSortingStrategy}

                    >

                        <TaskColumn

                            id="TODO"

                            title="To Do"

                            color="blue"

                            tasks={filteredTasks.todo}

                            onTaskClick={onTaskClick}

                        />

                    </SortableContext>

                    <SortableContext

                        items={filteredTasks.inProgress.map(task => task._id)}

                        strategy={verticalListSortingStrategy}

                    >

                        <TaskColumn

                            id="IN_PROGRESS"

                            title="In Progress"

                            color="yellow"

                            tasks={filteredTasks.inProgress}

                            onTaskClick={onTaskClick}

                        />

                    </SortableContext>

                    <SortableContext

                        items={filteredTasks.done.map(task => task._id)}

                        strategy={verticalListSortingStrategy}

                    >

                        <TaskColumn

                            id="DONE"

                            title="Done"

                            color="green"

                            tasks={filteredTasks.done}

                            onTaskClick={onTaskClick}

                        />

                    </SortableContext>

                </div>

            </DndContext>

        </div>

    );

}

export default TaskBoard;