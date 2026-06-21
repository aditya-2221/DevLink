import { useState } from "react";

function SocialLinksForm({
    user,
    onSubmit,
    loading,
}) {

    const [formData,
        setFormData] =
        useState({
            github:
                user?.github || "",
            linkedin:
                user?.linkedin || "",
            portfolio:
                user?.portfolio || "",
        });

    const handleChange = (
        e
    ) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });

    };

    const handleSubmit = (
        e
    ) => {

        e.preventDefault();

        onSubmit(formData);

    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4"
        >

            <input
                name="github"
                value={
                    formData.github
                }
                onChange={
                    handleChange
                }
                placeholder="Github URL"
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
                name="linkedin"
                value={
                    formData.linkedin
                }
                onChange={
                    handleChange
                }
                placeholder="LinkedIn URL"
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
                name="portfolio"
                value={
                    formData.portfolio
                }
                onChange={
                    handleChange
                }
                placeholder="Portfolio URL"
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
                        : "Save Links"
                }
            </button>

        </form>
    );
}

export default SocialLinksForm;