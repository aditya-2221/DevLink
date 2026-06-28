import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyProjects } from "../../services/projectService";
import { createTeam } from "../../services/teamService";

function CreateTeam() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [projects, setProjects] = useState([]);

    const [formData, setFormData] = useState({

        name: "",

        description: "",

        projectId: ""

    });

    useEffect(() => {

        fetchProjects();

    }, []);

    const fetchProjects = async () => {

        try {

            const response =await getMyProjects();

            setProjects(
                response.data.data
            );

        } catch (error) {

            console.log(error);

        }

    };
    const changeHandler = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value

        });

    };
    const submitHandler = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await createTeam(formData);

            navigate("/teams");

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };
    return (

        <div className="max-w-7xl mx-auto">

            <div className="mb-10">

                <h1 className="text-5xl font-bold text-white">
                    Create Team
                </h1>

                <p className="text-slate-400 mt-3">
                    Create a collaborative workspace for your project.
                </p>

            </div>

            <div className="grid lg:grid-cols-2 gap-10">

                {/* Left */}

                <form

                    onSubmit={submitHandler}

                    className="
                bg-slate-900/50

                border
                border-blue-500/10

                rounded-3xl

                p-8

                space-y-6
                "

                >

                    <div>

                        <label className="text-slate-300 text-sm">

                            Team Name

                        </label>

                        <input

                            type="text"

                            name="name"

                            value={formData.name}

                            onChange={changeHandler}

                            placeholder="Frontend Wizards"

                            className="
                        mt-2

                        w-full

                        rounded-xl

                        bg-slate-800/60

                        border
                        border-blue-500/10

                        px-4
                        py-3

                        text-white

                        outline-none

                        focus:border-blue-500/40
                        "

                            required

                        />

                    </div>

                    <div>

                        <label className="text-slate-300 text-sm">

                            Description

                        </label>

                        <textarea

                            rows="6"

                            name="description"

                            value={formData.description}

                            onChange={changeHandler}

                            placeholder="Describe your team..."

                            className="
                        mt-2

                        w-full

                        rounded-xl

                        bg-slate-800/60

                        border
                        border-blue-500/10

                        px-4
                        py-3

                        text-white

                        outline-none

                        resize-none

                        focus:border-blue-500/40
                        "

                        />

                    </div>

                    <div>

                        <label className="text-slate-300 text-sm">

                            Project

                        </label>

                        <select

                            name="projectId"

                            value={formData.projectId}

                            onChange={changeHandler}

                            className="
                        mt-2

                        w-full

                        rounded-xl

                        bg-slate-800/60

                        border
                        border-blue-500/10

                        px-4
                        py-3

                        text-white

                        outline-none

                        focus:border-blue-500/40
                        "

                            required

                        >

                            <option value="">

                                Select Project

                            </option>

                            {projects.map(project => (

                                <option

                                    key={project._id}

                                    value={project._id}

                                >

                                    {project.title}

                                </option>

                            ))}

                        </select>

                    </div>

                    <button

                        disabled={loading}

                        className="
                    w-full

                    rounded-xl

                    py-3

                    bg-gradient-to-r

                    from-blue-600
                    to-cyan-500

                    hover:from-blue-500
                    hover:to-cyan-400

                    text-white
                    font-semibold

                    transition
                    "

                    >

                        {loading

                            ? "Creating..."

                            : "Create Team"}

                    </button>

                </form>

                {/* Right */}

                <div
                    className="
                bg-slate-900/50

                border
                border-blue-500/10

                rounded-3xl

                p-8
                "
                >

                    <h2
                        className="
                    text-2xl
                    font-semibold
                    text-white
                    "
                    >

                        Live Preview

                    </h2>

                    <div
                        className="
                    mt-8

                    rounded-2xl

                    bg-slate-800/60

                    border
                    border-blue-500/10

                    p-6
                    "
                    >

                        <div
                            className="
                        h-16
                        w-16

                        rounded-2xl

                        bg-gradient-to-br
                        from-blue-600
                        to-cyan-500

                        flex
                        items-center
                        justify-center

                        text-2xl
                        font-bold
                        text-white
                        "
                        >

                            {formData.name
                                ? formData.name.charAt(0).toUpperCase()
                                : "T"}

                        </div>

                        <h2
                            className="
                        mt-6

                        text-2xl
                        font-bold
                        text-white
                        "
                        >

                            {formData.name || "Team Name"}

                        </h2>

                        <p
                            className="
                        mt-3

                        text-slate-400
                        "
                        >

                            {formData.description ||

                                "Your team description will appear here."}

                        </p>

                        <div
                            className="
                        mt-8

                        flex
                        gap-3
                        "
                        >

                            <span
                                className="
                            px-3
                            py-1

                            rounded-full

                            bg-blue-500/10

                            text-blue-400

                            border
                            border-blue-500/20

                            text-sm
                            "
                            >

                                {
                                    projects.find(

                                        p =>

                                            p._id === formData.projectId

                                    )?.title ||

                                    "No Project"

                                }

                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}
export default CreateTeam;