import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getRecruitmentById,
    updateRecruitment
} from "../../services/recruitmentService";

function EditRecruitment() {

    const { recruitmentId } =
        useParams();

    const navigate =
        useNavigate();

    const [title, setTitle] =
        useState("");

    const [
        description,
        setDescription
    ] = useState("");

    const [
        requiredSkills,
        setRequiredSkills
    ] = useState("");

    const [
        positions,
        setPositions
    ] = useState(1);

  

    const [loading, setLoading] =
        useState(false);

    const fetchRecruitment =
        async () => {

            try {

                setLoading(true);

                const response =
                    await getRecruitmentById(
                        recruitmentId
                    );

                const recruitment =
                    response.data.data;

                setTitle(
                    recruitment.title
                );

                setDescription(
                    recruitment.description
                );

                setRequiredSkills(
                    recruitment.requiredSkills.join(
                        ", "
                    )
                );

                setPositions(
                    recruitment.positions
                );

                

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }
        };

    useEffect(() => {

        fetchRecruitment();

    }, []);

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            try {

                setLoading(true);

                await updateRecruitment(
                    recruitmentId,
                    {
                        title,
                        description,
                        positions,
                        requiredSkills:
                            requiredSkills
                                .split(",")
                                .map(
                                    skill =>
                                        skill.trim()
                                )
                    }
                );

                navigate(
                    `/recruitments/${recruitmentId}`
                );

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }
        };

    return (
        <div
            className="
            max-w-3xl
            mx-auto
            "
        >

            <div
                className="
                bg-slate-900/50
                border
                border-blue-500/10
                rounded-2xl
                p-8
                "
            >

                <h1
                    className="
                    text-3xl
                    font-bold
                    text-white
                    mb-8
                    "
                >
                    Edit Recruitment
                </h1>

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                    space-y-5
                    "
                >

                    <input
                        value={title}
                        onChange={(e) =>
                            setTitle(
                                e.target.value
                            )
                        }
                        placeholder="Title"
                        className="
                        w-full
                        bg-slate-800
                        border
                        border-slate-700
                        rounded-xl
                        p-3
                        text-white
                        "
                    />

                    <textarea
                        rows={5}
                        value={
                            description
                        }
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                        placeholder="Description"
                        className="
                        w-full
                        bg-slate-800
                        border
                        border-slate-700
                        rounded-xl
                        p-3
                        text-white
                        "
                    />

                    <input
                        value={
                            requiredSkills
                        }
                        onChange={(e) =>
                            setRequiredSkills(
                                e.target.value
                            )
                        }
                        placeholder="React, Node, MongoDB"
                        className="
                        w-full
                        bg-slate-800
                        border
                        border-slate-700
                        rounded-xl
                        p-3
                        text-white
                        "
                    />

                    <input
                        type="number"
                        value={
                            positions
                        }
                        onChange={(e) =>
                            setPositions(
                                e.target.value
                            )
                        }
                        className="
                        w-full
                        bg-slate-800
                        border
                        border-slate-700
                        rounded-xl
                        p-3
                        text-white
                        "
                    />

                    

                    <button
                        type="submit"
                        disabled={
                            loading
                        }
                        className="
                        w-full
                        py-3
                        rounded-xl
                        bg-blue-600
                        hover:bg-blue-500
                        text-white
                        "
                    >
                        {
                            loading
                                ? "Updating..."
                                : "Update Recruitment"
                        }
                    </button>

                </form>

            </div>

        </div>
    );
}

export default EditRecruitment;