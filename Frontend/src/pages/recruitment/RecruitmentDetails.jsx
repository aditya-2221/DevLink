import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
    Briefcase,
    Users,
    Clock3,
} from "lucide-react";

import {
    setLoading,
    setError,
    setCurrentRecruitment,

} from "../../features/recruitment/recruitmentSlice";

import { getRecruitmentById, getMyApplications, deleteRecruitment, } from "../../services/recruitmentService";

import ApplyModal from "../../components/modals/ApplyModal";

function RecruitmentDetails() {
    const { user } = useSelector(
        state => state.auth
    );
    const { recruitmentId } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [recruitment, setRecruitment] = useState(null);
    const isClosed = recruitment?.status === "CLOSED";
    const isOwner = user?._id === recruitment?.owner?._id;

    const [showApplyModal, setShowApplyModal] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const avatarHandler = () => {
        navigate(`/profile/${recruitment.owner.username}`)
    }
    const handleDelete = async () => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this recruitment?"
            );

        if (!confirmDelete) return;

        try {

            dispatch(setLoading(true));

            await deleteRecruitment(
                recruitment._id
            );

            navigate("/recruitments");

        } catch (error) {

            dispatch(
                setError(
                    error?.response?.data?.message
                )
            );

        } finally {

            dispatch(setLoading(false));

        }
    };

    const checkApplicationStatus = async () => {

        try {

            const response = await getMyApplications();

            const applications =
                response.data.data.myApplications || [];

            const alreadyApplied =
                applications.some(
                    application =>
                        application?.recruitment?._id === recruitmentId
                );

            setHasApplied(alreadyApplied);

        }

        catch (error) {

            console.log(error);

        }

    };

    const fetchRecruitment = async () => {
        try {
            dispatch(setLoading(true));

            const response = await getRecruitmentById(
                recruitmentId
            );

            const data = response.data.data;

            setRecruitment(data);


            dispatch(
                setCurrentRecruitment(
                    data
                )
            );
        } catch (error) {
            dispatch(
                setError(
                    error?.response?.data
                        ?.message ||
                    "Failed to fetch recruitment"
                )
            );
        } finally {
            dispatch(
                setLoading(false)
            );
        }
    };

    useEffect(() => {
        fetchRecruitment();
        checkApplicationStatus();
    }, [recruitmentId]);

    if (!recruitment) {
        return (
            <div className="text-white">
                Loading...
            </div>
        );
    }

    return (
        <>
            <div className="space-y-8">

                {/* Header */}

                <div
                    className="
                    bg-slate-900/50
                    border
                    border-blue-500/10
                    rounded-2xl
                    p-8
                    backdrop-blur-xl
                "
                >
                    <div className="flex justify-between items-start">

                        <div>
                            <h1
                                className="
                                text-4xl
                                font-bold
                                text-white
                            "
                            >
                                {
                                    recruitment.title
                                }
                            </h1>

                            <p
                                className="
                                text-slate-400
                                mt-4
                            "
                            >
                                {
                                    recruitment.description
                                }
                            </p>
                        </div>

                        <span
                            className={`
                            px-4
                            py-2
                            rounded-full
                            text-sm
                            font-medium

                            ${recruitment.status ===
                                    "OPEN"
                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }
                        `}
                        >
                            {
                                recruitment.status
                            }
                        </span>
                    </div>

                    {/* Skills */}

                    <div className="mt-8">
                        <h3
                            className="
                            text-white
                            font-semibold
                            mb-3
                        "
                        >
                            Required Skills
                        </h3>

                        <div className="flex flex-wrap gap-2">

                            {recruitment.requiredSkills?.map(
                                (
                                    skill
                                ) => (
                                    <span
                                        key={
                                            skill
                                        }
                                        className="
                                        px-3
                                        py-1
                                        rounded-full
                                        text-sm
                                        bg-blue-500/10
                                        border
                                        border-blue-500/20
                                        text-blue-300
                                    "
                                    >
                                        {
                                            skill
                                        }
                                    </span>
                                )
                            )}

                        </div>
                    </div>
                    <div
                        className="
    grid
    grid-cols-2
    md:grid-cols-4
    gap-4
    mt-8
"
                    >

                        <div
                            className="
        bg-slate-950
        rounded-xl
        p-4
        border
        border-slate-800
    "
                        >
                            <p className="text-slate-400 text-sm">
                                Applications
                            </p>

                            <h3 className="text-white text-2xl font-bold">
                                {recruitment.applicantsCount}
                            </h3>
                        </div>

                        <div
                            className="
        bg-slate-950
        rounded-xl
        p-4
        border
        border-slate-800
    "
                        >
                            <p className="text-slate-400 text-sm">
                                Accepted
                            </p>

                            <h3 className="text-white text-2xl font-bold">
                                {recruitment.acceptedCount}
                            </h3>
                        </div>

                        <div
                            className="
        bg-slate-950
        rounded-xl
        p-4
        border
        border-slate-800
    "
                        >
                            <p className="text-slate-400 text-sm">
                                Remaining
                            </p>

                            <h3 className="text-white text-2xl font-bold">
                                {
                                    recruitment.positions -
                                    recruitment.acceptedCount
                                }
                            </h3>
                        </div>

                        <div
                            className="
        bg-slate-950
        rounded-xl
        p-4
        border
        border-slate-800
    "
                        >
                            <p className="text-slate-400 text-sm">
                                Positions
                            </p>

                            <h3 className="text-white text-2xl font-bold">
                                {recruitment.positions}
                            </h3>
                        </div>

                    </div>
                </div>

                {/* Details */}

                <div
                    className="
                    grid
                    grid-cols-1
                    lg:grid-cols-3
                    gap-6
                "
                >

                    <div
                        className="
                        lg:col-span-2
                        bg-slate-900/50
                        border
                        border-blue-500/10
                        rounded-2xl
                        p-6
                    "
                    >
                        <h2
                            className="
                            text-white
                            text-xl
                            font-semibold
                            mb-6
                        "
                        >
                            Recruitment Details
                        </h2>

                        <div className="space-y-4">

                            <div className="flex items-center gap-3 text-slate-300">
                                <Briefcase
                                    size={
                                        18
                                    }
                                />

                                <span>
                                    Project:
                                    {" "}
                                    {
                                        recruitment
                                            ?.project
                                            ?.title
                                    }
                                </span>
                            </div>

                            <div className="flex items-center gap-3 text-slate-300">
                                <Users
                                    size={
                                        18
                                    }
                                />

                                <span>
                                    {
                                        recruitment.positions
                                    }
                                    {" "}
                                    Position(s)
                                </span>
                            </div>

                            <div className="flex items-center gap-3 text-slate-300">
                                <Clock3
                                    size={
                                        18
                                    }
                                />

                                <span>
                                    {new Date(
                                        recruitment.createdAt
                                    ).toLocaleDateString()}
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Recruiter */}

                    <div
                        className="
                        bg-slate-900/50
                        border
                        border-blue-500/10
                        rounded-2xl
                        p-6
                    "
                    >
                        <h2
                            className="
                            text-white
                            text-lg
                            font-semibold
                            mb-6
                        "
                        >
                            Recruiter
                        </h2>

                        <div className="flex items-center gap-4">

                            <img
                                src={
                                    recruitment
                                        ?.owner
                                        ?.avatar
                                }
                                onClick={avatarHandler}
                                alt=""
                                className="
                                w-14
                                h-14
                                rounded-full
                                object-cover
                            "
                            />

                            <div>
                                <p
                                    className="
                                    text-white
                                    font-medium
                                "
                                >
                                    @
                                    {
                                        recruitment
                                            ?.owner
                                            ?.username
                                    }
                                </p>

                                <p
                                    className="
                                    text-slate-400
                                    text-sm
                                "
                                >
                                    Recruiter
                                </p>
                            </div>

                        </div>

                        {isOwner ? (
                            <div className="space-y-3 mt-8">

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/recruitments/${recruitment._id}/applications`
                                        )
                                    }
                                    className="
        w-full
        py-3
        rounded-xl
        bg-emerald-600
        hover:bg-emerald-500
        text-white
        "
                                >
                                    Manage Applications
                                </button>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/recruitments/${recruitment._id}/edit`
                                        )
                                    }
                                    className="
        w-full
        py-3
        rounded-xl
        bg-yellow-600
        hover:bg-yellow-500
        text-white
        "
                                >
                                    Edit Recruitment
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="
        w-full
        py-3
        rounded-xl
        bg-red-600
        hover:bg-red-500
        text-white
        "
                                >
                                    Delete Recruitment
                                </button>

                            </div>
                        ) : isClosed ? (
                            <button
                                disabled
                                className="
        w-full
        mt-8
        py-3
        rounded-xl
        bg-slate-700
        text-slate-400
    "
                            >
                                Recruitment Closed
                            </button>
                        ) : hasApplied ? (
                            <button
                                disabled
                                className="
        w-full
        mt-8
        py-3
        rounded-xl
        bg-blue-500/20
        text-blue-300
        cursor-not-allowed
    "
                            >
                                Already Applied
                            </button>
                        ) : (
                            <button
                                onClick={() =>
                                    setShowApplyModal(true)
                                }
                                className="
        w-full
        mt-8
        py-3
        rounded-xl
        bg-blue-600
        hover:bg-blue-500
        text-white
    "
                            >
                                Apply Now
                            </button>
                        )}
                    </div>

                </div>

            </div>

            <ApplyModal
                isOpen={showApplyModal}
                onClose={() =>
                    setShowApplyModal(false)
                }
                recruitmentId={recruitmentId}
                setHasApplied={
                    setHasApplied
                }
            />
        </>
    );
}

export default RecruitmentDetails;