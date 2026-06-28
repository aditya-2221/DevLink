import { useState } from "react";

function CreateTaskForm({
    team,
    onSubmit,
    loading
}) {

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignedTo: "",
        priority: "MEDIUM",
        dueDate: ""
    });

    const handleChange = (e) => {

        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit({
            ...formData,
            teamId: team._id
        });

    };



    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >

            {/* Title */}

            <div>

                <label className="text-sm text-slate-300 mb-2 block">

                    Task Title

                </label>

                <input
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Authentication APIs..."
                    className="
                    w-full

                    rounded-xl

                    bg-slate-900

                    border
                    border-white/10

                    px-4
                    py-3

                    text-white

                    outline-none

                    focus:border-blue-500
                "
                />

            </div>

            {/* Description */}

            <div>

                <label className="text-sm text-slate-300 mb-2 block">

                    Description

                </label>

                <textarea

                    rows={5}

                    name="description"

                    value={formData.description}

                    onChange={handleChange}

                    className="
                    w-full

                    rounded-xl

                    bg-slate-900

                    border
                    border-white/10

                    p-4

                    text-white

                    outline-none

                    focus:border-blue-500
                "
                />

            </div>

            {/* Member */}

            <div>

                <label className="text-sm text-slate-300 mb-2 block">

                    Assign To

                </label>

                <select

                    name="assignedTo"

                    value={formData.assignedTo}

                    onChange={handleChange}

                    className="
                    w-full

                    rounded-xl

                    bg-slate-900

                    border
                    border-white/10

                    px-4
                    py-3

                    text-white
                "
                >


                    {team.members.map(member => (
                        <option
                            key={member.user._id}
                            value={member.user._id}
                        >
                            {member.user.fullName}  (@{member.user.username})
                        </option>
                    ))}

                </select>

            </div>

            {/* Priority */}

            <div>

                <label className="text-sm text-slate-300 mb-2 block">

                    Priority

                </label>

                <select

                    name="priority"

                    value={formData.priority}

                    onChange={handleChange}

                    className="
                    w-full

                    rounded-xl

                    bg-slate-900

                    border
                    border-white/10

                    px-4
                    py-3

                    text-white
                "
                >

                    <option value="LOW">Low</option>

                    <option value="MEDIUM">Medium</option>

                    <option value="HIGH">High</option>

                </select>

            </div>

            {/* Due Date */}

            <div>

                <label className="text-sm text-slate-300 mb-2 block">

                    Due Date

                </label>

                <input

                    type="date"

                    name="dueDate"

                    value={formData.dueDate}

                    onChange={handleChange}

                    className="
                    w-full

                    rounded-xl

                    

                    border
                    border-white/10

                    px-4
                    py-3

                    text-white
                    outline-none
                  focus:border-blue-500

                    [color-scheme:dark]
                "
                />

            </div>

            <button

                disabled={loading}

                className="
                w-full

                py-3

                rounded-xl

                bg-gradient-to-r

                from-blue-600
                to-cyan-500

                hover:opacity-90

                text-white

                font-semibold

                transition-all
            "
            >

                {loading
                    ? "Creating..."
                    : "Create Task"}

            </button>

        </form>

    );

}

export default CreateTaskForm;