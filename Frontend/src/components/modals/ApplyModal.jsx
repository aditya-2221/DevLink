import { useState } from "react";
import { X } from "lucide-react";

import { applyToRecruitment } from "../../services/recruitmentService";

function ApplyModal({
    isOpen,
    onClose,
    recruitmentId,
    setHasApplied,
}){
    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleSubmit =
        async (e) => {
            e.preventDefault();

            try {
                setLoading(true);

                await applyToRecruitment(
                    recruitmentId,
                    {
                        message,
                    }
                );
                setHasApplied(true);

                alert(
                    "Application submitted successfully"
                );

                setMessage("");

                onClose();
            } catch (error) {
                alert(
                    error?.response?.data
                        ?.message ||
                        "Failed to apply"
                );
            } finally {
                setLoading(false);
            }
        };

    if (!isOpen) return null;

    return (
        <div
            className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            backdrop-blur-sm
        "
        >
            <div
                className="
                w-full
                max-w-lg
                bg-slate-900
                border
                border-blue-500/10
                rounded-2xl
                p-6
            "
            >
                {/* Header */}

                <div className="flex justify-between items-center mb-6">

                    <h2
                        className="
                        text-white
                        text-xl
                        font-semibold
                    "
                    >
                        Apply To Recruitment
                    </h2>

                    <button
                        onClick={onClose}
                        className="
                        text-slate-400
                        hover:text-white
                    "
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Form */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="space-y-5"
                >
                    <div>

                        <label
                            className="
                            block
                            text-sm
                            text-slate-300
                            mb-2
                        "
                        >
                            Why should the
                            recruiter choose
                            you?
                        </label>

                        <textarea
                            rows={6}
                            value={message}
                            onChange={(
                                e
                            ) =>
                                setMessage(
                                    e.target
                                        .value
                                )
                            }
                            placeholder="Describe your skills, experience and why you're interested..."
                            className="
                            w-full
                            bg-slate-800
                            border
                            border-slate-700
                            rounded-xl
                            p-4
                            text-white
                            outline-none
                            focus:border-blue-500
                        "
                            required
                        />

                    </div>

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
                        font-medium
                        transition
                        disabled:opacity-50
                    "
                    >
                        {loading
                            ? "Submitting..."
                            : "Submit Application"}
                    </button>

                </form>

            </div>
        </div>
    );
}

export default ApplyModal;