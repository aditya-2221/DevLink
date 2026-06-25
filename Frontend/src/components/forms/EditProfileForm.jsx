import { useState } from "react";

function EditProfileForm({
    user,
    onSubmit,
    loading,
}) {

    const [formData, setFormData] =
        useState({
            fullName:
                user?.fullName || "",
            bio:
                user?.bio || "",
            education:
                user?.education?.length
                    ? user.education
                    : [
                        {
                            institution: "",
                            degree: "",
                            fieldOfStudy: "",
                            startYear: "",
                            endYear: "",
                        },
                    ],
            location:
                user?.location || "",
            skills:
                user?.skills?.join(", ") ||
                "",
        });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });

    };
    const handleEducationChange = (
        index,
        field,
        value
    ) => {

        const updated =
            [...formData.education];

        updated[index][field] =
            value;

        setFormData({
            ...formData,
            education: updated,
        });

    };

    const addEducation = () => {

        setFormData({
            ...formData,
            education: [
                ...formData.education,
                {
                    institution: "",
                    degree: "",
                    fieldOfStudy: "",
                    startYear: "",
                    endYear: "",
                },
            ],
        });

    };

    const removeEducation = (
        index
    ) => {

        const updated =
            formData.education.filter(
                (_, i) => i !== index
            );

        setFormData({
            ...formData,
            education: updated,
        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit({
            ...formData,
            skills:
                formData.skills
                    .split(",")
                    .map((s) =>
                        s.trim()
                    )
                    .filter(Boolean),
        });

    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4"
        >

            <input
                name="fullName"
                value={
                    formData.fullName
                }
                onChange={
                    handleChange
                }
                placeholder="Full Name"
                className="
                w-full
                p-3
                rounded-xl
                bg-slate-900
                border
                border-slate-700
                text-white
                "
            />

            <textarea
                rows={4}
                name="bio"
                maxLength={150}

                value={
                    formData.bio
                }
                onChange={
                    handleChange
                }
                placeholder="Bio"
                className="
                w-full
                
                p-3
                rounded-xl
                bg-slate-900
                border
                border-slate-700
                text-white
                
                "
            />
            <p className="text-xs text-slate-500 mt-1">
                {formData.bio.length}/150 characters
            </p>

            <input
                name="location"
                value={
                    formData.location
                }
                onChange={
                    handleChange
                }
                placeholder="Location"
                className="
                w-full
                p-3
                rounded-xl
                bg-slate-900
                border
                border-slate-700
                text-white
                "
            />

            <div
                className="
    bg-slate-900/40
    border
    border-slate-800
    rounded-2xl
    p-4
    "
            >

                <div
                    className="
        flex
        justify-between
        items-center
        mb-4
        "
                >

                    <h3
                        className="
            text-white
            font-semibold
            "
                    >
                        Education
                    </h3>

                    <button
                        type="button"
                        onClick={addEducation}
                        className="
            px-3
            py-1
            rounded-lg
            bg-blue-600
            text-white
            text-sm
            "
                    >
                        + Add
                    </button>

                </div>

                <div className="space-y-6">

                    {formData.education.map(
                        (edu, index) => (

                            <div
                                key={index}
                                className="
                    border
                    border-slate-800
                    rounded-xl
                    p-4
                    space-y-3
                    "
                            >

                                <input
                                    value={
                                        edu.institution
                                    }
                                    onChange={(e) =>
                                        handleEducationChange(
                                            index,
                                            "institution",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Institution"
                                    className="
                        w-full
                        p-3
                        rounded-xl
                        bg-slate-900
                        border
                        border-slate-700
                        text-white
                        "
                                />

                                <input
                                    value={
                                        edu.degree
                                    }
                                    onChange={(e) =>
                                        handleEducationChange(
                                            index,
                                            "degree",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Degree"
                                    className="
                        w-full
                        p-3
                        rounded-xl
                        bg-slate-900
                        border
                        border-slate-700
                        text-white
                        "
                                />

                                <input
                                    value={
                                        edu.fieldOfStudy
                                    }
                                    onChange={(e) =>
                                        handleEducationChange(
                                            index,
                                            "fieldOfStudy",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Field Of Study"
                                    className="
                        w-full
                        p-3
                        rounded-xl
                        bg-slate-900
                        border
                        border-slate-700
                        text-white
                        "
                                />

                                <div
                                    className="
                        grid
                        grid-cols-2
                        gap-3
                        "
                                >

                                    <input
                                        type="number"
                                        value={
                                            edu.startYear
                                        }
                                        onChange={(e) =>
                                            handleEducationChange(
                                                index,
                                                "startYear",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Start Year"
                                        className="
                            p-3
                            rounded-xl
                            bg-slate-900
                            border
                            border-slate-700
                            text-white
                            "
                                    />

                                    <input
                                        type="number"
                                        value={
                                            edu.endYear
                                        }
                                        onChange={(e) =>
                                            handleEducationChange(
                                                index,
                                                "endYear",
                                                e.target.value
                                            )
                                        }
                                        placeholder="End Year"
                                        className="
                            p-3
                            rounded-xl
                            bg-slate-900
                            border
                            border-slate-700
                            text-white
                            "
                                    />

                                </div>

                                {formData.education
                                    .length > 1 && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeEducation(
                                                    index
                                                )
                                            }
                                            className="
                            text-red-400
                            text-sm
                            "
                                        >
                                            Remove Education
                                        </button>

                                    )}

                            </div>
                        )
                    )}

                </div>

            </div>

            <input
                name="skills"
                value={
                    formData.skills
                }
                onChange={
                    handleChange
                }
                placeholder="Add Skills like : React, Node, MongoDB"
                className="
                w-full
                p-3
                rounded-xl
                bg-slate-900
                border
                border-slate-700
                text-white
                "
            />

            <button
                disabled={loading}
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
                        ? "Saving..."
                        : "Save Changes"
                }
            </button>

        </form>
    );
}

export default EditProfileForm;