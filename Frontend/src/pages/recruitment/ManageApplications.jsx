import { useEffect, useState } from "react";
import { useParams ,useNavigate} from "react-router-dom";

import {
    getRecruitmentApplications,
    acceptApplication,
    rejectApplication
} from "../../services/recruitmentService";

function ManageApplications() {

    const { recruitmentId } = useParams();
    const navigate = useNavigate()
    const [applications, setApplications] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const fetchApplications =
        async () => {
            try {

                setLoading(true);

                const response =
                    await getRecruitmentApplications(
                        recruitmentId
                    );

                setApplications(
                    response.data.data
                );

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }
        };

    useEffect(() => {

        fetchApplications();

    }, [recruitmentId]);

    const handleAccept =
        async (applicationId) => {

            try {

                await acceptApplication(
                    applicationId
                );

                fetchApplications();

            } catch (error) {

                alert(
                    error?.response?.data?.message ||
                    "Failed to accept application"
                );

            }
        };

    const handleReject =
        async (applicationId) => {

            try {

                await rejectApplication(
                    applicationId
                );

                fetchApplications();

            } catch (error) {

                alert(
                    error?.response?.data?.message ||
                    "Failed to reject application"
                );

            }
        };

    if (loading) {
        return (
            <div className="text-white">
                Loading applications...
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Header */}

            <div>

                <h1
                    className="
                    text-4xl
                    font-bold
                    text-white
                "
                >
                    Manage Applications
                </h1>

                <p
                    className="
                    text-slate-400
                    mt-2
                "
                >
                    Review applicants and manage recruitment applications
                </p>

            </div>

            {/* Empty State */}

            {
                applications.length === 0 ? (

                    <div
                        className="
                        bg-slate-900/50
                        border
                        border-blue-500/10
                        rounded-2xl
                        p-10
                        text-center
                    "
                    >

                        <h2
                            className="
                            text-2xl
                            text-white
                            font-semibold
                        "
                        >
                            No Applications Yet
                        </h2>

                        <p
                            className="
                            text-slate-400
                            mt-2
                        "
                        >
                            Nobody has applied for this recruitment yet.
                        </p>

                    </div>

                ) : (

                    <div
                        className="
                        grid
                        grid-cols-1
                        gap-6
                    "
                    >

                        {
                            applications.map(
                                (application) => (

                                    <div
                                        key={
                                            application._id
                                        }
                                        className="
                                        bg-slate-900/50
                                        border
                                        border-blue-500/10
                                        rounded-2xl
                                        p-6
                                        backdrop-blur-xl
                                    "
                                    >

                                        {/* Top */}

                                        <div
                                            className="
                                            flex
                                            justify-between
                                            items-start
                                        "
                                        >

                                            <div
                                                className="
                                                flex
                                                gap-4
                                            "
                                            >

                                                <img
                                                    src={
                                                        application
                                                            ?.applicant
                                                            ?.avatar
                                                    }
                                                    onClick={()=>{navigate(`/profile/${application.applicant.username}`)}}
                                                    alt=""
                                                    className="
                                                    w-14
                                                    h-14
                                                    rounded-full
                                                    object-cover
                                                    border
                                                    border-blue-500/20
                                                "
                                                />

                                                <div>

                                                    <h2
                                                        className="
                                                        text-white
                                                        text-lg
                                                        font-semibold
                                                    "
                                                    >
                                                        @
                                                        {
                                                            application
                                                                ?.applicant
                                                                ?.username
                                                        }
                                                    </h2>

                                                    <p
                                                        className="
                                                        text-slate-400
                                                        text-sm
                                                    "
                                                    >
                                                        Applicant
                                                    </p>

                                                </div>

                                            </div>

                                            <span
                                                className={`
                                                px-3
                                                py-1
                                                rounded-full
                                                text-xs
                                                font-medium

                                                ${
                                                    application.status ===
                                                    "ACCEPTED"
                                                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                                        : application.status ===
                                                          "REJECTED"
                                                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                                        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                                }
                                            `}
                                            >
                                                {
                                                    application.status
                                                }
                                            </span>

                                        </div>

                                        {/* Skills */}

                                        <div
                                            className="
                                            flex
                                            flex-wrap
                                            gap-2
                                            mt-5
                                        "
                                        >

                                            {
                                                application
                                                    ?.applicant
                                                    ?.skills
                                                    ?.map(
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
                                                                text-xs
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
                                                    )
                                            }

                                        </div>

                                        {/* Message */}

                                        <div
                                            className="
                                            mt-5
                                        "
                                        >

                                            <h3
                                                className="
                                                text-white
                                                font-medium
                                                mb-2
                                            "
                                            >
                                                Application Message
                                            </h3>

                                            <p
                                                className="
                                                text-slate-300
                                            "
                                            >
                                                {
                                                    application.message
                                                }
                                            </p>

                                        </div>

                                        {/* Date */}

                                        <div
                                            className="
                                            mt-5
                                            text-sm
                                            text-slate-400
                                        "
                                        >
                                            Applied on{" "}
                                            {
                                                new Date(
                                                    application.createdAt
                                                ).toLocaleDateString()
                                            }
                                        </div>

                                        {/* Actions */}

                                        {
                                            application.status ===
                                            "PENDING" && (

                                                <div
                                                    className="
                                                    flex
                                                    gap-3
                                                    mt-6
                                                "
                                                >

                                                    <button
                                                        onClick={() =>
                                                            handleAccept(
                                                                application._id
                                                            )
                                                        }
                                                        className="
                                                        px-4
                                                        py-2
                                                        rounded-lg
                                                        bg-green-600
                                                        hover:bg-green-500
                                                        text-white
                                                        transition
                                                    "
                                                    >
                                                        Accept
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleReject(
                                                                application._id
                                                            )
                                                        }
                                                        className="
                                                        px-4
                                                        py-2
                                                        rounded-lg
                                                        bg-red-600
                                                        hover:bg-red-500
                                                        text-white
                                                        transition
                                                    "
                                                    >
                                                        Reject
                                                    </button>

                                                </div>

                                            )
                                        }

                                    </div>

                                )
                            )
                        }

                    </div>

                )
            }

        </div>
    );
}

export default ManageApplications;