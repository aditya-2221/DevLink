import { Sparkles } from "lucide-react";

function AIActionCard({

    title,

    description,

    onClick,

    loading

}) {

    return (

        <button

            onClick={onClick}

            disabled={loading}

            className="
                w-full

                rounded-2xl

                border
                border-slate-700

                bg-slate-800/40

                p-6

                text-left

                transition-all

                hover:border-cyan-500

                hover:bg-slate-800/70

                disabled:opacity-50
            "

        >

            <div className="flex items-center gap-3">

                <Sparkles

                    className="text-cyan-400"

                    size={22}

                />

                <h3 className="text-lg font-semibold text-white">

                    {title}

                </h3>

            </div>

            <p className="mt-3 text-sm text-slate-400">

                {description}

            </p>

        </button>

    );

}

export default AIActionCard;