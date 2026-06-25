import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyProjects } from "../../services/projectService";
import { createRecruitment } from "../../services/recruitmentService";

function CreateRecruitment() {

    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);

    const [formData, setFormData] = useState({
        projectId: "",
        title: "",
        description: "",
        requiredSkills: "",
        positions: 1
    });

    const [loading, setLoading] =
        useState(false);

    const fetchProjects = async () => {

        try {

            const response =
                await getMyProjects();

            setProjects(
                response.data.data
            );

        } catch (error) {

            console.error(error);

        }
    };

    useEffect(() => {

        fetchProjects();

    }, []);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await createRecruitment({
                projectId:
                    formData.projectId,

                title:
                    formData.title,

                description:
                    formData.description,

                requiredSkills:
                    formData.requiredSkills
                        .split(",")
                        .map(skill =>
                            skill.trim()
                        ),

                positions:
                    Number(
                        formData.positions
                    )
            });

            navigate("/recruitments");

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="max-w-4xl mx-auto">

            {/* Header */}

            <div className="mb-8">

                <h1
                    className="
                    text-5xl
                    font-bold
                    text-white
                    "
                >
                    Create Recruitment
                </h1>

                <p className="text-slate-400 mt-2">
                    Find teammates for
                    your project
                </p>

            </div>

            {/* Form */}

            <form
                onSubmit={handleSubmit}
                className="
                bg-slate-900/50
                backdrop-blur-xl
                border
                border-blue-500/10
                rounded-2xl
                p-8
                space-y-6
                "
            >

                {/* Project */}

                <div>

                    <label
                        className="
                        block
                        text-white
                        mb-2
                        "
                    >
                        Project
                    </label>

                    <select
                        name="projectId"
                        value={
                            formData.projectId
                        }
                        onChange={
                            handleChange
                        }
                        required
                        className="
                        w-full
                        bg-slate-950
                        border
                        border-slate-700
                        rounded-xl
                        px-4
                        py-3
                        text-white
                        "
                    >

                        <option value="">
                            Select Project
                        </option>

                        {projects.map(
                            project => (
                                <option
                                    key={
                                        project._id
                                    }
                                    value={
                                        project._id
                                    }
                                >
                                    {
                                        project.title
                                    }
                                </option>
                            )
                        )}

                    </select>

                </div>

                {/* Title */}

                <div>

                    <label
                        className="
                        block
                        text-white
                        mb-2
                        "
                    >
                        Recruitment Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={
                            formData.title
                        }
                        onChange={
                            handleChange
                        }
                        required
                        className="
                        w-full
                        bg-slate-950
                        border
                        border-slate-700
                        rounded-xl
                        px-4
                        py-3
                        text-white
                        "
                    />

                </div>

                {/* Description */}

                <div>

                    <label
                        className="
                        block
                        text-white
                        mb-2
                        "
                    >
                        Description
                    </label>

                    <textarea
                        rows="6"
                        name="description"
                        value={
                            formData.description
                        }
                        onChange={
                            handleChange
                        }
                        required
                        className="
                        w-full
                        bg-slate-950
                        border
                        border-slate-700
                        rounded-xl
                        px-4
                        py-3
                        text-white
                        resize-none
                        "
                    />

                </div>

                {/* Skills */}

                <div>

                    <label
                        className="
                        block
                        text-white
                        mb-2
                        "
                    >
                        Required Skills
                    </label>

                    <input
                        type="text"
                        name="requiredSkills"
                        value={
                            formData.requiredSkills
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="
React, Node.js, MongoDB
"
                        className="
                        w-full
                        bg-slate-950
                        border
                        border-slate-700
                        rounded-xl
                        px-4
                        py-3
                        text-white
                        "
                    />

                </div>

                {/* Positions */}

                <div>

                    <label
                        className="
                        block
                        text-white
                        mb-2
                        "
                    >
                        Positions
                    </label>

                    <input
                        type="number"
                        min="1"
                        name="positions"
                        value={
                            formData.positions
                        }
                        onChange={
                            handleChange
                        }
                        className="
                        w-full
                        bg-slate-950
                        border
                        border-slate-700
                        rounded-xl
                        px-4
                        py-3
                        text-white
                        "
                    />

                </div>

                {/* Button */}

                <button
                    type="submit"
                    disabled={loading}
                    className="
                    w-full
                    bg-blue-600
                    hover:bg-blue-500
                    rounded-xl
                    py-3
                    text-white
                    font-semibold
                    transition
                    "
                >
                    {loading
                        ? "Creating..."
                        : "Create Recruitment"}
                </button>

            </form>
        </div>
    );
}

export default CreateRecruitment;