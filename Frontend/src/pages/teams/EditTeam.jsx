import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getTeamById,
    updateTeam
} from "../../services/teamService";

function EditTeam() {

    const { teamId } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(false);

    const [fetching, setFetching] =
        useState(true);

    const [formData, setFormData] =
        useState({

            name: "",

            description: ""

        });

    const inputClass = `
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

        transition
    `;

    useEffect(() => {

        fetchTeam();

    }, [teamId]);

    const fetchTeam = async () => {

        try {

            const response =
                await getTeamById(teamId);

            const team =
                response.data.data;

            setFormData({

                name: team.name,

                description:
                    team.description || ""

            });

        }

        catch (err) {

            console.log(err);

            navigate("/teams");

        }

        finally {

            setFetching(false);

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

            await updateTeam(

                teamId,

                formData

            );

            navigate(

                `/teams/${teamId}`

            );

        }

        catch (err) {

            console.log(err);

            alert(

                err.response?.data?.message ||

                "Unable to update team."

            );

        }

        finally {

            setLoading(false);

        }

    };

    if (fetching) {

        return (

            <div
                className="
                h-[70vh]

                flex

                items-center
                justify-center
                "
            >

                <div
                    className="
                    h-12
                    w-12

                    rounded-full

                    border-4

                    border-blue-500/20

                    border-t-blue-500

                    animate-spin
                    "
                />

            </div>

        );

    }

    return (

        <div className="max-w-6xl mx-auto">

            {/* Header */}

            <div className="mb-10">

                <h1
                    className="
                    text-5xl

                    font-bold

                    text-white
                    "
                >

                    Edit Team

                </h1>

                <p
                    className="
                    mt-3

                    text-slate-400
                    "
                >

                    Update your team information.

                </p>

            </div>

            <div
                className="
                grid

                lg:grid-cols-2

                gap-10
                "
            >
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

                            className={inputClass}

                            placeholder="Team Name"

                            required

                        />

                    </div>

                    <div>

                        <label className="text-slate-300 text-sm">

                            Description

                        </label>

                        <textarea

                            rows="7"

                            name="description"

                            value={formData.description}

                            onChange={changeHandler}

                            className={`${inputClass} resize-none`}

                            placeholder="Describe your team..."

                        />

                    </div>

                    <div className="flex justify-end gap-4 pt-4">

                        <button

                            type="button"

                            onClick={() =>
                                navigate(`/teams/${teamId}`)
                            }

                            className="
                        px-6
                        py-3

                        rounded-xl

                        border
                        border-slate-700

                        text-slate-300

                        hover:bg-slate-800

                        transition
                        "

                        >

                            Cancel

                        </button>

                        <button

                            type="submit"

                            disabled={loading}

                            className="
                        px-8
                        py-3

                        rounded-xl

                        bg-gradient-to-r

                        from-blue-600
                        to-cyan-500

                        hover:from-blue-500
                        hover:to-cyan-400

                        disabled:opacity-50

                        text-white

                        font-semibold

                        transition
                        "

                        >

                            {

                                loading

                                    ?

                                    "Saving..."

                                    :

                                    "Save Changes"

                            }

                        </button>

                    </div>

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

                            {

                                formData.name

                                    ?

                                    formData.name
                                        .charAt(0)
                                        .toUpperCase()

                                    :

                                    "T"

                            }

                        </div>

                        <h2

                            className="
                        mt-6

                        text-3xl

                        font-bold

                        text-white
                        "

                        >

                            {

                                formData.name ||

                                "Team Name"

                            }

                        </h2>

                        <p

                            className="
                        mt-4

                        text-slate-400

                        leading-7
                        "

                        >

                            {

                                formData.description ||

                                "Your team description will appear here."

                            }

                        </p>

                        <div

                            className="
                        mt-8

                        rounded-xl

                        bg-blue-500/10

                        border
                        border-blue-500/20

                        px-4
                        py-3
                        "

                        >

                            <p className="text-blue-300 text-sm">

                                Any changes made here will also update your
                                team's group conversation name automatically.

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default EditTeam;