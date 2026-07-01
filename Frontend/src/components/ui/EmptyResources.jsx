import { FolderOpen, Upload } from "lucide-react";

function EmptyResources({ onUpload }) {

    return (

        <div
            className="
            rounded-3xl

            border-2
            border-dashed
            border-blue-500/10

            bg-slate-900/40

            py-24

            text-center
        "
        >

            <FolderOpen
                size={56}
                className="mx-auto text-cyan-400"
            />

            <h2 className="mt-6 text-2xl font-semibold text-white">

                No Resources Yet

            </h2>

            <p className="mt-3 text-slate-400">

                Upload files and share them with your team.

            </p>

            <button

                onClick={onUpload}

                className="
                mt-8

                inline-flex

                items-center

                gap-2

                rounded-xl

                bg-gradient-to-r

                from-blue-600
                to-cyan-500

                px-6
                py-3

                text-white

                hover:scale-105

                transition
                "

            >

                <Upload size={18}/>

                Upload Resource

            </button>

        </div>

    );

}

export default EmptyResources;