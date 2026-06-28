import {
    CalendarDays,
    User,
    MessageCircle,
    Paperclip,
    Circle,
    GripVertical
} from "lucide-react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function TaskCard({ task, onClick }) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task._id
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 999 : 1
    };

    const priorityConfig = {

        HIGH: {

            label: "High",

            strip: "bg-rose-400",

            badge:
                "bg-rose-500/10 text-rose-300 border border-rose-400/20"

        },

        MEDIUM: {

            label: "Medium",

            strip: "bg-amber-400",

            badge:
                "bg-amber-500/10 text-amber-300 border border-amber-400/20"

        },

        LOW: {

            label: "Low",

            strip: "bg-emerald-400",

            badge:
                "bg-emerald-500/10 text-emerald-300 border border-emerald-400/20"

        }

    };

    const priority =
        priorityConfig[task.priority] ||
        priorityConfig.MEDIUM;

    const getDueDate = () => {

        if (!task.dueDate)

            return {

                label: "No Due",

                color: "text-slate-500"

            };

        const due = new Date(task.dueDate);

        const today = new Date();

        due.setHours(0, 0, 0, 0);

        today.setHours(0, 0, 0, 0);

        const diff = Math.ceil(

            (due - today) /

            (1000 * 60 * 60 * 24)

        );

        if (diff < 0)

            return {

                label: `${Math.abs(diff)}d overdue`,

                color: "text-rose-300"

            };

        if (diff === 0)

            return {

                label: "Today",

                color: "text-amber-300"

            };

        if (diff === 1)

            return {

                label: "Tomorrow",

                color: "text-cyan-300"

            };

        return {

            label: `${diff} days left`,

            color: "text-slate-400"

        };

    };

    const dueInfo = getDueDate();

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            onClick={() => onClick?.(task)}
            className={`
            relative
            overflow-hidden

            rounded-[24px]

            bg-gradient-to-br
            from-[#19253A]
            via-[#162238]
            to-[#111827]

            border

            ${isDragging
                    ? "border-cyan-400 shadow-2xl shadow-cyan-500/20 scale-[1.02]"
                    : "border-blue-500/10 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1"
                }

            transition-all
            duration-300

            p-5

            cursor-pointer
        `}
        >

            {/* Priority Strip */}

            <div
                className={`
                absolute
                top-0
                left-0
                right-0

                h-[3px]

                ${priority.strip}
            `}
            />

            {/* Header */}

            <div className="flex justify-between items-start gap-4">

                <div className="flex-1">

                    <h3
                        className="
                        text-[17px]
                        font-semibold

                        text-slate-100

                        leading-6

                        group-hover:text-cyan-300

                        transition

                        line-clamp-2
                    "
                    >
                        {task.title}
                    </h3>

                    <p
                        className="
                        mt-3

                        text-[13px]

                        leading-6

                        text-slate-400

                        line-clamp-2
                    "
                    >
                        {task.description || "No description provided."}
                    </p>

                </div>

                <div className="flex flex-col items-end gap-3">

                    <span
                        className={`
                        inline-flex
                        items-center
                        gap-2

                        rounded-full

                        px-3
                        py-1

                        text-[11px]
                        font-semibold

                        ${priority.badge}
                    `}
                    >
                        <Circle
                            size={8}
                            fill="currentColor"
                        />

                        {priority.label}
                    </span>

                    {/* Drag Handle */}

                    <button
                        {...listeners}
                        onClick={(e) => e.stopPropagation()}
                        className="
                        p-2

                        rounded-xl

                        text-slate-500

                        hover:text-cyan-300

                        hover:bg-cyan-500/10

                        cursor-grab

                        active:cursor-grabbing

                        transition
                    "
                    >
                        <GripVertical size={17} />
                    </button>

                </div>

            </div>

            {/* Divider */}

            <div className="mt-5 border-t border-blue-500/10"></div>
            {/* Footer */}

            <div className="mt-5 flex items-end justify-between">

                {/* Assignee */}

                <div className="flex items-center gap-3">

                    {task.assignedTo?.avatar ? (

                        <img
                            src={task.assignedTo.avatar}
                            alt={task.assignedTo.fullName}
                            className="
                            h-11
                            w-11

                            rounded-full

                            object-cover

                            border-2
                            border-cyan-500/20

                            shadow-lg
                            shadow-cyan-500/10
                        "
                        />

                    ) : (

                        <div
                            className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center

                            rounded-full

                            bg-[#1D2940]

                            border
                            border-blue-500/10
                        "
                        >

                            <User
                                size={18}
                                className="text-slate-400"
                            />

                        </div>

                    )}

                    <div>

                        <h4
                            className="
                            text-sm
                            font-semibold

                            text-slate-100
                        "
                        >
                            {task.assignedTo?.fullName || "Unassigned"}
                        </h4>

                        <p
                            className="
                            mt-0.5

                            text-xs

                            text-slate-500
                        "
                        >
                            {task.assignedTo?.username
                                ? `@${task.assignedTo.username}`
                                : "No Assignee"}
                        </p>

                    </div>

                </div>

                {/* Due Date */}

                <div className="text-right">

                    <div
                        className={`
                        inline-flex
                        items-center
                        gap-2

                        rounded-full

                        bg-cyan-500/10

                        px-3
                        py-1.5

                        text-xs
                        font-medium

                        ${dueInfo.color}
                    `}
                    >

                        <CalendarDays
                            size={14}
                            className="text-cyan-400"
                        />

                        {dueInfo.label}

                    </div>

                    

                </div>

            </div>
            

            {/* Hover Glow */}

            <div
                className="
                pointer-events-none

                absolute
                inset-0

                rounded-[24px]

                bg-gradient-to-br
                from-cyan-400/0
                via-transparent
                to-blue-500/0

                opacity-0

                transition-opacity
                duration-300

                group-hover:opacity-100
            "
            />

        </div>

    );

}

export default TaskCard;
