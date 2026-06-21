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
                user?.education || "",
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

            <input
                name="education"
                value={
                    formData.education
                }
                onChange={
                    handleChange
                }
                placeholder="Education"
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