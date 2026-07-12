import { useState } from "react";
import { useSelector } from "react-redux";
import {
    Check,
    Clock3,
    UserPlus,
    X
} from "lucide-react";

const RequestsDrawer = ({
    open,
    onClose,
    onAccept,
    onReject,
    onCancel
}) => {

    const [activeTab, setActiveTab] =
        useState("received");

    const {
        pendingRequests,
        sentRequests,
        requestLoading
    } = useSelector(
        state => state.chat
    );

    if (!open) {
        return null;
    }

    return (

        <>

            <div
                onClick={onClose}
                className="
                    fixed
                    inset-0
                    bg-black/50
                    z-40
                "
            />

            <div
                className="
                    fixed
                    top-0
                    right-0
                    h-screen
                    w-[420px]
                    bg-slate-950
                    border-l
                    border-slate-800
                    shadow-2xl
                    z-50
                    flex
                    flex-col
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        p-5
                        border-b
                        border-slate-800
                    "
                >

                    <h2
                        className="
                            text-xl
                            font-semibold
                            text-slate-200
                        "
                    >

                        Chat Requests

                    </h2>

                    <button
                        onClick={onClose}
                        className="text-slate-300"
                    >

                        <X size={22} />

                    </button>

                </div>

                <div
                    className="
                        p-4
                        flex
                        gap-3
                    "
                >

                    <button
                        onClick={() =>
                            setActiveTab(
                                "received"
                            )
                        }
                        className={`
                            flex-1
                            rounded-xl
                            py-2

                            ${activeTab ===
                                "received"

                                ? "bg-blue-600"

                                : "bg-slate-800"
                            }
                        `}
                    >

                        Received

                    </button>

                    <button
                        onClick={() =>
                            setActiveTab(
                                "sent"
                            )
                        }
                        className={`
                            flex-1
                            rounded-xl
                            py-2

                            ${activeTab ===
                                "sent"

                                ? "bg-blue-600"

                                : "bg-slate-800"
                            }
                        `}
                    >

                        Sent

                    </button>

                </div>

                <div
                    className="
                        flex-1
                        overflow-y-auto
                        px-4
                        pb-5
                    "
                >

                    {

                        requestLoading ?

                            (

                                <div
                                    className="
                                        h-full
                                        flex
                                        items-center
                                        justify-center
                                        text-slate-500
                                    "
                                >

                                    Loading...

                                </div>

                            )

                            :

                            activeTab ===
                                "received"

                                ?

                                pendingRequests.length ===
                                    0

                                    ?

                                    (

                                        <div
                                            className="
                                                h-full
                                                flex
                                                flex-col
                                                items-center
                                                justify-center
                                                text-slate-500
                                            "
                                        >

                                            <UserPlus
                                                size={
                                                    42
                                                }
                                            />

                                            <p
                                                className="
                                                    mt-4
                                                "
                                            >

                                                No pending requests

                                            </p>

                                        </div>

                                    )

                                    :

                                    pendingRequests.map(
                                        (
                                            request
                                        ) => (

                                            <div
                                                key={
                                                    request._id
                                                }
                                                className="
                                                    rounded-2xl
                                                    border
                                                    border-slate-800
                                                    bg-slate-900
                                                    p-4
                                                    mb-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    "
                                                >

                                                    <img
                                                        src={
                                                            request.sender.avatar
                                                        }
                                                        alt=""
                                                        className="
                                                            h-12
                                                            w-12
                                                            rounded-full
                                                            object-cover
                                                        "
                                                    />

                                                    <div>

                                                        <h3
                                                            className="
                                                                font-semibold
                                                                text-slate-300
                                                            "
                                                        >

                                                            {
                                                                request.sender.fullName
                                                            }

                                                        </h3>

                                                        <p
                                                            className="
                                                                text-sm
                                                                text-slate-400
                                                            "
                                                        >

                                                            @
                                                            {
                                                                request.sender.username
                                                            }

                                                        </p>

                                                        {
                                                            request.message && (

                                                                <p
                                                                    className="
                mt-3
                text-sm
                text-slate-300
                italic
            "
                                                                >
                                                                    "{request.message}"
                                                                </p>

                                                            )
                                                        }

                                                    </div>

                                                </div>

                                                <div
                                                    className="
                                                        mt-4
                                                        flex
                                                        gap-3
                                                    "
                                                >

                                                    <button
                                                        onClick={() =>
                                                            onAccept(
                                                                request._id
                                                            )
                                                        }
                                                        className="
                                                            flex-1
                                                            rounded-xl
                                                            bg-green-600
                                                            py-2
                                                            flex
                                                            items-center
                                                            justify-center
                                                            gap-2
                                                        "
                                                    >

                                                        <Check
                                                            size={
                                                                16
                                                            }
                                                        />

                                                        Accept

                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            onReject(
                                                                request._id
                                                            )
                                                        }
                                                        className="
                                                            flex-1
                                                            rounded-xl
                                                            bg-red-600
                                                            py-2
                                                            flex
                                                            items-center
                                                            justify-center
                                                            gap-2
                                                        "
                                                    >

                                                        <X
                                                            size={
                                                                16
                                                            }
                                                        />

                                                        Reject

                                                    </button>

                                                </div>

                                            </div>

                                        )
                                    )

                                :

                                sentRequests.length ===
                                    0

                                    ?

                                    (

                                        <div
                                            className="
                                                h-full
                                                flex
                                                flex-col
                                                items-center
                                                justify-center
                                                text-slate-500
                                            "
                                        >

                                            <Clock3
                                                size={
                                                    42
                                                }
                                            />

                                            <p
                                                className="
                                                    mt-4
                                                "
                                            >

                                                No pending requests

                                            </p>

                                        </div>

                                    )

                                    :

                                    sentRequests.map(
                                        (
                                            request
                                        ) => (

                                            <div
                                                key={
                                                    request._id
                                                }
                                                className="
                                                    rounded-2xl
                                                    border
                                                    border-slate-800
                                                    bg-slate-900
                                                    p-4
                                                    mb-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    "
                                                >

                                                    <img
                                                        src={
                                                            request.receiver.avatar
                                                        }
                                                        alt=""
                                                        className="
                                                            h-12
                                                            w-12
                                                            rounded-full
                                                            object-cover
                                                        "
                                                    />

                                                    <div>

                                                        <h3
                                                            className="
                                                                font-semibold
                                                            "
                                                        >

                                                            {
                                                                request.receiver.fullName
                                                            }

                                                        </h3>

                                                        <p
                                                            className="
                                                                text-sm
                                                                text-slate-400
                                                            "
                                                        >

                                                            Pending...

                                                        </p>

                                                    </div>

                                                </div>

                                                <button
                                                    onClick={() =>
                                                        onCancel(
                                                            request._id
                                                        )
                                                    }
                                                    className="
                                                        mt-4
                                                        w-full
                                                        rounded-xl
                                                        bg-slate-800
                                                        py-2
                                                    "
                                                >

                                                    Cancel Request

                                                </button>

                                            </div>

                                        )
                                    )

                    }

                </div>

            </div>

        </>

    );

};

export default RequestsDrawer;