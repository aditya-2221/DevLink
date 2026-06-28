function TeamSkeleton() {
    return (
        <div
            className="
            bg-slate-900/50
            backdrop-blur-xl

            border
            border-blue-500/10

            rounded-2xl

            p-6

            animate-pulse
            "
        >
            {/* Header */}

            <div className="flex justify-between items-start">

                <div className="flex-1">

                    <div
                        className="
                        h-7
                        w-44

                        rounded-lg

                        bg-slate-800
                        "
                    />

                    <div
                        className="
                        h-4
                        w-full

                        mt-4

                        rounded

                        bg-slate-800
                        "
                    />

                    <div
                        className="
                        h-4
                        w-2/3

                        mt-2

                        rounded

                        bg-slate-800
                        "
                    />

                </div>

                <div
                    className="
                    h-12
                    w-12

                    rounded-xl

                    bg-slate-800
                    "
                />

            </div>

            {/* Stats */}

            <div
                className="
                grid
                grid-cols-2
                gap-4

                mt-8
                "
            >

                <div
                    className="
                    h-5
                    bg-slate-800
                    rounded
                    "
                />

                <div
                    className="
                    h-5
                    bg-slate-800
                    rounded
                    "
                />

            </div>

            {/* Owner */}

            <div
                className="
                flex
                items-center
                justify-between

                mt-8
                "
            >

                <div
                    className="
                    flex
                    items-center
                    gap-3
                    "
                >

                    <div
                        className="
                        h-11
                        w-11

                        rounded-full

                        bg-slate-800
                        "
                    />

                    <div>

                        <div
                            className="
                            h-4
                            w-28

                            rounded

                            bg-slate-800
                            "
                        />

                        <div
                            className="
                            h-3
                            w-20

                            mt-2

                            rounded

                            bg-slate-800
                            "
                        />

                    </div>

                </div>

                <div
                    className="
                    h-10
                    w-24

                    rounded-lg

                    bg-slate-800
                    "
                />

            </div>

            {/* Footer */}

            <div
                className="
                flex
                justify-between

                mt-8

                pt-5

                border-t
                border-slate-800
                "
            >

                <div
                    className="
                    h-4
                    w-24

                    rounded

                    bg-slate-800
                    "
                />

                <div
                    className="
                    h-6
                    w-16

                    rounded-full

                    bg-slate-800
                    "
                />

            </div>

        </div>
    );
}

export default TeamSkeleton;