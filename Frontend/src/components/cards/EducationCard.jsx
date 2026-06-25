import { useSelector } from "react-redux";
import { FaGraduationCap } from "react-icons/fa";

function EducationCard({user}) {

    

    return (
        <div
            className="
            bg-slate-900/50
            border
            border-blue-500/10
            rounded-2xl
            p-6
            "
        >

            <div className="flex items-center gap-4 mb-6">

                <FaGraduationCap
                    className="
                    text-blue-400
                    text-xl
                    "
                />

                <h2
                    className="
                    text-xl
                    font-semibold
                    text-white
                    "
                >
                    Education
                </h2>

            </div>

            {user?.education?.length > 0 ? (

                <div className="space-y-8">

                    {user.education.map(
                        (edu, index) => (

                            <div
                                key={index}
                                className="
                                relative
                                pl-8
                                border-l-2
                                border-blue-500/20
                                "
                            >

                                {/* Timeline Dot */}

                                <div
                                    className="
                                    absolute
                                    -left-[9px]
                                    top-1
                                    w-4
                                    h-4
                                    rounded-full
                                    bg-blue-500
                                    shadow-[0_0_15px_rgba(59,130,246,0.7)]
                                    "
                                />

                                <h3
                                    className="
                                    text-white
                                    text-lg
                                    font-semibold
                                    "
                                >
                                    {edu.institution}
                                </h3>

                                <p
                                    className="
                                    text-blue-400
                                    mt-1
                                    "
                                >
                                    {edu.degree}
                                    {edu.fieldOfStudy &&
                                        ` • ${edu.fieldOfStudy}`}
                                </p>

                                <p
                                    className="
                                    text-slate-400
                                    text-sm
                                    mt-2
                                    "
                                >
                                    {edu.startYear}
                                    {" - "}
                                    {edu.endYear || "Present"}
                                </p>

                            </div>
                        )
                    )}

                </div>

            ) : (

                <div
                    className="
                    text-center
                    py-8
                    "
                >
                    <p className="text-slate-400">
                        No education details added yet.
                    </p>
                </div>

            )}

        </div>
    );
}

export default EducationCard;