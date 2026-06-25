import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import RecruitmentCard from "../../components/cards/RecruitmentCard";
import RecruitmentTabs from "../../components/navigation/RecruitmentTabs";
import RecruitmentFilters from "../../components/forms/RecruitmentFilters";

import {
    getRecruitments,
    getMyRecruitments,
    getMyApplications,
    getRecruitmentSkills
} from "../../services/recruitmentService";

import {
    setRecruitments,
    setMyRecruitments,
    setMyApplications,
    setLoading,
    setError,
    setPagination,
} from "../../features/recruitment/recruitmentSlice";

import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

function Recruitments() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const [search, setSearch] = useState("");
    const [skill, setSkill] = useState("");
    const [sort, setSort] = useState("latest");
    const [availableSkills, setAvailableSkills] = useState([]);
    const [status, setStatus] = useState("");

    const {
        recruitments,
        myRecruitments,
        myApplications,
        loading,
        error,
        totalPages,
        totalRecruitments
    } = useSelector(
        (state) => state.recruitment
    );

    const fetchData = async () => {
        try {
            dispatch(setLoading(true));

            switch (activeTab) {

                case "my": {
                    const response = await getMyRecruitments({
                        page: currentPage,
                        limit: 10
                    });

                    dispatch(
                        setMyRecruitments(
                            response.data.data.recruitments
                        )
                    );

                    dispatch(
                        setPagination({
                            page:
                                response.data.data.page,
                            totalPages:
                                response.data.data.totalPages,
                            totalRecruitments:
                                response.data.data.totalRecruitments
                        })
                    );

                    break;
                }

                case "applied": {
                    const response = await getMyApplications({
                        page: currentPage,
                        limit: 10
                    });

                    dispatch(
                        setMyApplications(
                            response.data.data.applications
                        )
                    );

                    dispatch(
                        setPagination({
                            page:
                                response.data.data.page,
                            totalPages:
                                response.data.data.totalPages,
                            totalRecruitments:
                                response.data.data.totalApplications
                        })
                    );

                    break;
                }

                default: {
                    const response =
                        await getRecruitments({
                            search,
                            status,
                            skill,
                            sort,
                            currentPage,
                            limit: 10
                        });

                    dispatch(
                        setRecruitments(
                            response.data.data
                                .recruitments
                        )
                    );

                    dispatch(
                        setPagination({
                            page:
                                response.data.data.page,
                            totalPages:
                                response.data.data
                                    .totalPages,
                            totalRecruitments:
                                response.data.data
                                    .totalRecruitments,
                        })
                    );
                }
            }
        } catch (error) {
            dispatch(
                setError(
                    error?.response?.data
                        ?.message ||
                    "Failed to fetch recruitments"
                )
            );
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab, search, skill, sort, status, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search
    ]);

    const fetchSkills = async () => {

        try {

            const response = await getRecruitmentSkills();

            setAvailableSkills(
                response.data.data
            );

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const renderContent = () => {

        if (
            activeTab === "create"
        ) {
            return (
                <div
                    className="
          flex
          items-center
          justify-center
          py-20
          "
                >
                    <button
                        onClick={() =>
                            navigate(
                                "/recruitments/create"
                            )
                        }
                        className="
            flex
            items-center
            gap-3
            px-6
            py-3
            bg-blue-600
            hover:bg-blue-500
            rounded-xl
            text-white
            "
                    >
                        <FiPlus />
                        Create Recruitment
                    </button>
                </div>
            );
        }

        if (
            activeTab === "applied"
        )

            if (
                !myApplications?.length
            ) {
                return (
                    <div
                        className="
            flex
            flex-col
            items-center
            justify-center
            py-20
        "
                    >
                        <h2
                            className="
                text-white
                text-2xl
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
                            Start applying to recruitments and track them here.
                        </p>
                    </div>
                );
            }
        {
            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


                    {myApplications?.map(
                        (application) => (
                            <div
                                key={application._id}
                                className="
bg-slate-900/50
border
border-blue-500/10
rounded-xl
p-5
hover:border-blue-500/20
hover:-translate-y-1
transition-all
duration-300
"
                            >
                                <h3 className="text-white font-semibold">
                                    {
                                        application
                                            ?.recruitment
                                            ?.title
                                    }
                                </h3>
                                <p
                                    className="
    text-slate-500
    text-sm
    mt-2
"
                                >
                                    Applied on{" "}
                                    {new Date(
                                        application.createdAt
                                    ).toLocaleDateString()}
                                </p>

                                <p className="text-slate-400 mt-3 text-sm">
                                    {
                                        application
                                            ?.message
                                    }
                                </p>

                                <div
                                    className="
    flex
    flex-wrap
    gap-3
    mt-4
"
                                >
                                    <div
                                        className="
        px-3
        py-1
        rounded-lg
        bg-slate-800
        text-slate-300
        text-xs
    "
                                    >
                                        Positions:
                                        {" "}
                                        {
                                            application?.recruitment
                                                ?.positions
                                        }
                                    </div>

                                    <div
                                        className="
        px-3
        py-1
        rounded-lg
        bg-slate-800
        text-slate-300
        text-xs
    "
                                    >
                                        Recruitment:
                                        {" "}
                                        {
                                            application?.recruitment
                                                ?.status
                                        }
                                    </div>
                                </div>

                                <span
                                    className={`
    inline-flex
    items-center
    mt-4
    px-3
    py-1
    rounded-full
    text-xs
    font-medium

    ${application?.status === "ACCEPTED"
                                            ? "bg-green-500/10 text-green-400 border border-green-500/20"

                                            : application?.status === "REJECTED"
                                                ? "bg-red-500/10 text-red-400 border border-red-500/20"

                                                : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                        }
`}
                                >
                                    {application?.status}
                                </span>
                            </div>
                        )
                    )}

                </div>

            );
        }

        const data = activeTab === "my" ? myRecruitments : recruitments;

        if (
            !data ||
            data.length === 0
        ) {
            return (
                <div
                    className="
          flex
          flex-col
          items-center
          justify-center
          py-20
          "
                >
                    <h2 className="text-white text-2xl">
                        No Recruitments Found
                    </h2>

                    <p className="text-slate-400 mt-2">
                        Try changing filters
                        or create a recruitment.
                    </p>
                </div>
            );
        }
        const totalApplications = myRecruitments?.reduce(
            (
                total,
                recruitment
            ) =>
                total +
                (
                    recruitment
                        .applicantsCount || 0
                ),
            0
        );

        const totalAccepted = myRecruitments?.reduce(
            (
                total,
                recruitment
            ) =>
                total +
                (
                    recruitment.acceptedCount || 0
                ),
            0
        );
        const acceptanceRate = totalApplications
            ? Math.round(
                (
                    totalAccepted / totalApplications
                ) * 100
            )
            : 0;

        const openRecruitments = myRecruitments?.filter(
            recruitment => recruitment.status === "OPEN"
        ).length;

        return (
            <>
                {activeTab === "my" && (
                    <div
                        className="
                grid
                grid-cols-2
                lg:grid-cols-4
                gap-4
                mb-8
                "
                    >

                        <div
                            className="
                    bg-slate-900/50
                    border
                    border-blue-500/10
                    rounded-xl
                    p-5
                    "
                        >
                            <p className="text-slate-400 text-sm">
                                Recruitments
                            </p>

                            <h2 className="text-3xl font-bold text-white mt-2">
                                {myRecruitments.length}
                            </h2>
                        </div>

                        <div
                            className="
                    bg-slate-900/50
                    border
                    border-blue-500/10
                    rounded-xl
                    p-5
                    "
                        >
                            <p className="text-slate-400 text-sm">
                                Open
                            </p>

                            <h2 className="text-3xl font-bold text-green-400 mt-2">
                                {openRecruitments}
                            </h2>
                        </div>

                        <div
                            className="
                    bg-slate-900/50
                    border
                    border-blue-500/10
                    rounded-xl
                    p-5
                    "
                        >
                            <p className="text-slate-400 text-sm">
                                Applications
                            </p>

                            <h2 className="text-3xl font-bold text-blue-400 mt-2">
                                {totalApplications}
                            </h2>
                        </div>

                        <div
                            className="
                    bg-slate-900/50
                    border
                    border-blue-500/10
                    rounded-xl
                    p-5
                    "
                        >
                            <p className="text-slate-400 text-sm">
                                Acceptance Rate
                            </p>

                            <h2 className="text-3xl font-bold text-purple-400 mt-2">
                                {acceptanceRate}%
                            </h2>
                        </div>

                    </div>
                )}

                <div
                    className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
            "
                >
                    {data.map(
                        (recruitment) => (
                            <RecruitmentCard
                                key={recruitment._id}
                                recruitment={recruitment}
                            />
                        )
                    )}
                </div>
            </>
        );
    };

    if (loading) {
        return (
            <h1 className="text-white">
                Loading...
            </h1>
        );
    }

    if (error) {
        return (
            <h1 className="text-red-400">
                {error}
            </h1>
        );
    }

    return (
        <div className="space-y-8">

            {/* Header */}

            <div className="flex justify-between items-start">

                <div>
                    <h1
                        className="
            text-5xl
            font-bold
            text-white
            "
                    >
                        Recruitments
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Find teammates and
                        join exciting projects
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate(
                            "/recruitments/create"
                        )
                    }
                    className="
          flex
          items-center
          gap-2
          px-4
          py-2
          rounded-lg
          bg-blue-600
          hover:bg-blue-500
          text-white
          "
                >
                    <FiPlus />
                    New Recruitment
                </button>
            </div>

            {/* Tabs */}

            <RecruitmentTabs
                activeTab={activeTab}
                setActiveTab={
                    setActiveTab
                }
            />

            {/* Filters */}

            {activeTab === "all" && (
                <RecruitmentFilters
                    search={search}
                    setSearch={setSearch}
                    status={status}
                    setStatus={setStatus}
                    skill={skill}
                    sort={sort}
                    setSkill={setSkill}
                    setSort={setSort}
                    availableSkills={availableSkills}
                />
            )}

            {/* Content */}

            {renderContent()}
            {activeTab !== "create" && (
                <div
                    className="
        flex
        justify-center
        items-center
        gap-4
        mt-10
    "
                >
                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage(
                                prev => prev - 1
                            )
                        }
                        className="
            px-4
            py-2
            rounded-lg
            bg-slate-800
            text-white
            disabled:opacity-50
        "
                    >
                        Previous
                    </button>

                    <span className="text-white">
                        Page {currentPage}
                        {" / "}
                        {totalPages || 1}
                    </span>

                    <button
                        disabled={
                            currentPage === totalPages
                        }
                        onClick={() =>
                            setCurrentPage(
                                prev => prev + 1
                            )
                        }
                        className="
            px-4
            py-2
            rounded-lg
            bg-slate-800
            text-white
            disabled:opacity-50
        "
                    >
                        Next
                    </button>
                </div>
            )}

        </div>
    );
}

export default Recruitments;