import {
    X,
    Download,
    Trash2,
    Image as ImageIcon,
    FileText,
    Archive,
    File
} from "lucide-react";

function ResourcePreviewModal({

    open,

    resource,

    canDelete,

    onClose,

    onDelete,

    onDownload

}) {

    if (!open || !resource) return null;

    const isImage =
        resource.mimeType?.startsWith("image");

    const isPdf =
        resource.mimeType === "application/pdf";

    const isArchive =
        resource.mimeType?.includes("zip") ||
        resource.mimeType?.includes("rar");

    return (

        <>

            <div

                onClick={onClose}

                className="
                fixed inset-0

                bg-black/80

                backdrop-blur-md

                z-50
                "

            />

            <div

                className="
                fixed

                left-1/2
                top-1/2

                -translate-x-1/2
                -translate-y-1/2

                w-[90vw]

                h-[90vh]

                rounded-3xl

                bg-[#111827]

                border
                border-blue-500/10

                z-[60]

                overflow-hidden

                flex
                flex-col
                "

            >

                {/* Header */}

                <div
                    className="
                    flex

                    justify-between

                    items-center

                    p-6

                    border-b

                    border-slate-800
                "
                >

                    <div>

                        <h2
                            className="
                            text-xl

                            font-semibold

                            text-white
                        "
                        >

                            {resource.fileName}

                        </h2>

                        <p
                            className="
                            text-slate-400

                            text-sm
                        "
                        >

                            {resource.uploadedBy.fullName}

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="
                        p-2

                        rounded-xl

                        hover:bg-slate-800
                        "

                    >

                        <X/>

                    </button>

                </div>

                {/* Preview */}

                <div className="flex-1 overflow-auto bg-slate-950">

                    {

                        isImage && (

                            <img

                                src={resource.url}

                                className="
                                max-w-full

                                mx-auto

                                object-contain
                                "

                            />

                        )

                    }

                    {

                        isPdf && (

                            <iframe

                                src={resource.url}

                                title={resource.fileName}

                                className="w-full h-full"

                            />

                        )

                    }

                    {

                        !isImage &&

                        !isPdf && (

                            <div
                                className="
                                h-full

                                flex

                                flex-col

                                justify-center

                                items-center

                                gap-6
                            "
                            >

                                {

                                    isArchive

                                    ?

                                    <Archive
                                        size={90}
                                        className="text-yellow-400"
                                    />

                                    :

                                    <FileText
                                        size={90}
                                        className="text-cyan-400"
                                    />

                                }

                                <h2 className="text-white text-2xl">

                                    {resource.fileName}

                                </h2>

                            </div>

                        )

                    }

                </div>

                {/* Footer */}

                <div
                    className="
                    flex

                    justify-between

                    items-center

                    p-6

                    border-t

                    border-slate-800
                "
                >

                    <div className="text-slate-400">

                        {(resource.size / 1024 / 1024).toFixed(2)}

                        MB

                    </div>

                    <div className="flex gap-4">

                        <button

                            onClick={()=>

                                onDownload(resource)

                            }

                            className="
                            flex

                            items-center

                            gap-2

                            px-5
                            py-3

                            rounded-xl

                            bg-cyan-600

                            text-white
                            "

                        >

                            <Download size={18}/>

                            Download

                        </button>

                        {

                            canDelete && (

                                <button

                                    onClick={()=>

                                        onDelete(resource)

                                    }

                                    className="
                                    flex

                                    items-center

                                    gap-2

                                    px-5
                                    py-3

                                    rounded-xl

                                    bg-red-600

                                    text-white
                                    "

                                >

                                    <Trash2 size={18}/>

                                    Delete

                                </button>

                            )

                        }

                    </div>

                </div>

            </div>

        </>

    );

}

export default ResourcePreviewModal;