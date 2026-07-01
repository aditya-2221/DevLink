import { useState } from "react";
import { X, Upload, FilePlus } from "lucide-react";
import toast from "react-hot-toast";

import { uploadResources } from "../../services/resourceService";

function UploadResourceModal({

    open,

    onClose,

    teamId,

    refreshResources

}) {

    const [files, setFiles] = useState([]);

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragging, setDragging] = useState(false);


    if (!open) return null;

    const handleChange = (e) => {


        setFiles(

            Array.from(e.target.files)

        );

    };

    const handleUpload = async () => {

        if (files.length === 0) {

            toast.error("Select at least one file");

            return;

        }

        try {

            setUploading(true);

            const formData = new FormData();

            files.forEach(file => {

                formData.append(

                    "resources",

                    file

                );

            });

            await uploadResources(

                teamId,

                formData,

                (event) => {

                    if (!event.total) return;

                    const percent = Math.round(

                        (event.loaded * 100) / event.total

                    );

                    setProgress(percent);

                    console.log(percent);   // 👈 Here

                }

            );

            toast.success(

                "Resources uploaded"

            );
            setProgress(0);

            refreshResources();

            onClose();

            setFiles([]);

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Upload failed"

            );

        }

        finally {

            setUploading(false);

            setProgress(0);

        }

    };

    return (

        <>

            {/* Overlay */}

            <div

                onClick={onClose}

                className="
                fixed
                inset-0

                bg-black/70

                backdrop-blur-sm

                z-40
                "

            />

            {/* Modal */}

            <div

                className="
                fixed

                left-1/2
                top-1/2

                -translate-x-1/2
                -translate-y-1/2

                w-[520px]

                rounded-3xl

                bg-[#111827]

                border
                border-blue-500/10

                shadow-2xl

                z-50

                p-8
                "

            >

                {/* Header */}

                <div className="flex justify-between items-center">

                    <div>

                        <h2 className="text-2xl font-bold text-white">

                            Upload Resources

                        </h2>

                        <p className="text-slate-400 mt-2">

                            Share files with your team

                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="
        p-2

        rounded-xl

        text-white

        hover:bg-slate-800

        transition-colors
    "
                    >
                        <X size={22} strokeWidth={1} />
                    </button>

                </div>

                {/* Upload */}

                <label
                    htmlFor="resource-upload"

                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragEnter={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        setDragging(false);
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);

                        setFiles(Array.from(e.dataTransfer.files));
                    }}
                    className={`
        mt-8

        flex
        flex-col
        items-center
        justify-center

        rounded-3xl

        border-2
        border-dashed

        p-12

        cursor-pointer

        transition-all
        duration-300

        ${dragging
                            ? "border-cyan-400 bg-cyan-500/10 scale-[1.01]"
                            : "border-cyan-500/20 bg-slate-900/40 hover:border-cyan-400"
                        }
    `}

                >

                    {
                        dragging ? (

                            <>
                                <Upload
                                    size={52}
                                    className="text-cyan-300 animate-bounce"
                                />

                                <h3 className="mt-4 text-xl font-semibold text-cyan-300">

                                    Drop files here

                                </h3>

                            </>

                        ) : (

                            <>
                                <Upload
                                    size={48}
                                    className="text-cyan-400"
                                />

                                <h3 className="mt-4 text-lg text-white">

                                    Click or Drag Files

                                </h3>

                                <p className="mt-2 text-slate-500">

                                    Images, PDFs, Docs, ZIPs...

                                </p>

                            </>

                        )
                    }

                    <input
                        id="resource-upload"
                        hidden
                        multiple
                        type="file"
                        accept="
        image/*,
        application/pdf,
        application/msword,
        application/vnd.openxmlformats-officedocument.wordprocessingml.document,
        application/vnd.ms-excel,
        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
        application/zip,
        application/x-rar-compressed,
        text/plain
    "
                        onChange={handleChange}

                    />

                </label>

                {/* Selected Files */}

                {

                    files.length > 0 && (

                        <div className="mt-6 space-y-3 max-h-56 overflow-y-auto">

                            {

                                files.map(file => {

                                    console.log(files);
                                    return (
                                        <div

                                            key={file.name}

                                            className="
                                        flex

                                        items-center

                                        gap-3

                                        rounded-xl

                                        bg-slate-900

                                        p-3
                                        "

                                        >

                                            <FilePlus

                                                className="text-cyan-400"

                                                size={18}

                                            />

                                            <div className="flex-1">

                                                <p className="text-white text-sm">

                                                    {file.name}

                                                </p>

                                                <p className="text-slate-500 text-xs">

                                                    {(file.size / 1024 / 1024).toFixed(2)} MB

                                                </p>

                                            </div>

                                        </div>
                                    )

                                })

                            }

                        </div>

                    )

                }

                {uploading && (
                    <div className="mt-6">

                        <div className="flex justify-between mb-2 text-sm">

                            <span className="text-slate-300">
                                Uploading...
                            </span>

                            <span className="text-cyan-400 font-medium">
                                {progress}%
                            </span>

                        </div>

                        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">

                            <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                                style={{
                                    width: `${progress}%`
                                }}
                            />

                        </div>

                    </div>
                )}

                {/* Footer */}

                <div className="flex justify-end gap-4 mt-8">

                    <button

                        onClick={() => {
                            setFiles([]);
                            onClose();
                        }}

                        disabled={uploading}

                        className="
                        px-5
                        py-3

                        rounded-xl

                        bg-slate-700

                        text-white
                        "

                    >

                        Cancel

                    </button>

                    <button

                        disabled={uploading || files.length === 0}
                        onClick={handleUpload}

                        className="
                        px-6
                        py-3

                        rounded-xl

                        bg-gradient-to-r

                        from-blue-600
                        to-cyan-500

                        text-white

                        font-semibold

                        disabled:opacity-60
                        "

                    >

                        {

                            uploading

                                ?

                                "Uploading..."

                                :

                                "Upload"

                        }

                    </button>

                </div>

            </div>

        </>

    );

}

export default UploadResourceModal;