import {
    File,
    FileText,
    Image,
    Archive,
    Video,
    Download,
    Trash2,
    CalendarDays,
    HardDrive
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";

function ResourceCard({

    resource,

    onPreview

}) {

    const getIcon = () => {

        const type = resource.mimeType;

        if (type?.startsWith("video"))

            return (
                <Video
                    size={28}
                    className="text-purple-400"
                />
            );

        if (type?.includes("pdf"))

            return (
                <FileText
                    size={28}
                    className="text-red-400"
                />
            );

        if (
            type?.includes("zip") ||
            type?.includes("rar")
        )

            return (
                <Archive
                    size={28}
                    className="text-yellow-400"
                />
            );

        return (
            <File
                size={28}
                className="text-cyan-400"
            />
        );

    };

    const formatSize = (bytes) => {

        if (!bytes) return "0 B";

        const sizes = [

            "B",

            "KB",

            "MB",

            "GB"

        ];

        const i = Math.floor(

            Math.log(bytes) /

            Math.log(1024)

        );

        return (

            (bytes / Math.pow(1024, i))

                .toFixed(1)

            +

            " "

            +

            sizes[i]

        );

    };

    return (

        <div
            onClick={() => onPreview(resource)}
            className="
            group
            relative

            rounded-3xl

            bg-gradient-to-br
            from-[#162238]
            via-[#111827]
            to-[#0f172a]

            border
            border-blue-500/10

            p-6

            hover:border-cyan-400/20

            hover:-translate-y-1

            hover:shadow-2xl

            hover:shadow-cyan-500/10

            transition-all
            duration-300
        "
        >

            {/* Header */}

            <div className="flex justify-between">

                <div
                    className="
                    h-14
                    w-14

                    rounded-2xl

                    bg-cyan-500/10

                    flex
                    items-center
                    justify-center
                "
                >

                    {

                        resource.mimeType?.startsWith("image")

                            ?

                            <img

                                src={resource.url}

                                className="
h-14
w-14

rounded-2xl

object-cover
"

                            />

                            :

                            getIcon()

                    }

                </div>

                <div className="text-cyan-400 text-sm font-medium">

                    Click to Preview

                </div>

            </div>

            {/* File Name */}

            <h3
                className="
                mt-5

                text-lg

                font-semibold

                text-white

                break-words

                line-clamp-2
            "
            >

                {resource.fileName}

            </h3>

            {/* File Size */}

            <div
                className="
                mt-4

                flex
                items-center
                gap-2

                text-slate-400
                text-sm
            "
            >

                <HardDrive size={15} />

                {formatSize(resource.size)}

            </div>

            {/* Uploaded By */}

            <div className="mt-5 flex items-center gap-3">

                <img

                    src={resource.uploadedBy.avatar}

                    alt=""

                    className="
                    h-10
                    w-10

                    rounded-full

                    object-cover
                "

                />

                <div>

                    <p className="text-white text-sm">

                        {resource.uploadedBy.fullName}

                    </p>

                    <p className="text-slate-500 text-xs">

                        @{resource.uploadedBy.username}

                    </p>

                </div>

            </div>

            {/* Footer */}

            <div
                className="
                mt-6

                flex

                justify-between

                items-center
            "
            >

                <div
                    className="
                    flex

                    items-center

                    gap-2

                    text-slate-500

                    text-xs
                "
                >

                    <CalendarDays size={14} />

                    {

                        formatDistanceToNow(

                            new Date(resource.createdAt),

                            {

                                addSuffix: true

                            }

                        )

                    }

                </div>

                <span
                    className="
                    rounded-full

                    bg-blue-500/10

                    px-3
                    py-1

                    text-xs

                    text-blue-300
                "
                >

                    {resource.downloads}

                    {" "}Downloads

                </span>

            </div>
            <div
                className="
        absolute
        inset-0

        rounded-3xl

        bg-black/0

        group-hover:bg-black/10

        transition
        pointer-events-none
    "
            />

        </div>

    );

}

export default ResourceCard;