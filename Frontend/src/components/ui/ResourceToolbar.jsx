import {
    Search,
    Upload,
    ArrowUpDown
} from "lucide-react";

function ResourceToolbar({

    search,

    setSearch,

    type,

    setType,

    sort,

    setSort,
    totalResources,

    onUpload

}) {

    return (

        <div className="space-y-5">

            {/* Search + Upload */}

            <div className="flex flex-col lg:flex-row gap-4">

                <div
                    className="
                    flex-1

                    flex
                    items-center
                    gap-3

                    rounded-2xl

                    bg-slate-900

                    border
                    border-blue-500/10

                    px-5
                    py-3

                    focus-within:border-cyan-400/40

                    transition
                "
                >

                    <Search
                        size={18}
                        className="text-slate-500"
                    />

                    <input

                        value={search}

                        onChange={(e) =>

                            setSearch(e.target.value)

                        }

                        placeholder="Search resources..."

                        className="
                        flex-1

                        bg-transparent

                        outline-none

                        text-white

                        placeholder:text-slate-500
                        "

                    />

                </div>

                <button

                    onClick={onUpload}

                    className="
                    flex
                    items-center
                    justify-center
                    gap-2

                    rounded-2xl

                    bg-gradient-to-r

                    from-blue-600
                    to-cyan-500

                    px-6
                    py-3

                    text-white

                    font-semibold

                    hover:scale-105

                    transition
                "

                >

                    <Upload size={18} />

                    Upload Resource

                </button>

            </div>

            {/* Filters */}

            <div className="flex flex-wrap items-center gap-3">

                {/* File Type */}

                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="
            rounded-xl
            bg-slate-900
            border
            border-blue-500/10
            px-4
            py-2.5
            text-white
            outline-none
            focus:border-cyan-400
        "
                >
                    <option value="ALL">All Files</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                    <option value="raw">Documents</option>
                </select>

                {/* Sort */}

                <div
                    className="
            flex
            items-center
            gap-2

            rounded-xl

            bg-slate-900

            border
            border-blue-500/10

            px-4
            py-2.5
        "
                >
                    <ArrowUpDown
                        size={16}
                        className="text-slate-400"
                    />

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="
                 bg-slate-900
                outline-none
                text-white
            "
                    >
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                        <option value="name">Name</option>
                        <option value="size">Size</option>
                    </select>
                </div>

                {/* Resource Count */}

                <div
                    className="
            flex
            items-center
            gap-2

            rounded-xl

            bg-cyan-500/10

            border
            border-cyan-500/20

            px-4
            py-2.5
        "
                >
                    <span className="text-lg">📁</span>

                    <span className="font-semibold text-white">
                        {totalResources}
                    </span>

                    <span className="text-slate-400">
                        {totalResources === 1 ? "Resource" : "Resources"}
                    </span>
                </div>

            </div>

        </div>

    );

}

export default ResourceToolbar;