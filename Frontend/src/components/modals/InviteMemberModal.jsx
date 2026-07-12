import { useEffect, useState } from "react";
import api from "../../api/axios";
import { inviteMember } from "../../services/teamService";

function InviteMemberModal({
    open,
    onClose,
    teamId,
    onInvite
}) {

    const [query, setQuery] = useState("");

    const [loading, setLoading] = useState(false);

    const [inviting, setInviting] = useState("");

    const [users, setUsers] = useState([]);

    useEffect(() => {

        if (!open) return;

        const timeout = setTimeout(() => {

            fetchUsers();

        }, 300);

        return () => clearTimeout(timeout);

    }, [query, open]);

    const fetchUsers = async () => {

        if (!query.trim()) {

            setUsers([]);

            return;

        }

        try {

            setLoading(true);

            const res = await api.get("/search", {

                params: {

                    q: query,

                    type: "users",

                    limit: 10,

                    excludeTeam: teamId

                }

            });

            setUsers(res.data.data.users);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    const handleInvite = async (userId) => {

        try {

            setInviting(userId);

            await inviteMember(
                teamId,
                userId
            );

            if (onInvite) {

                onInvite();

            }

            setUsers(prev =>
                prev.filter(
                    user => user._id !== userId
                )
            );

        }

        catch (err) {
            console.log(err.response?.data);
            console.log(err.response?.data?.message);
        }
        finally {

            setInviting("");

        }

    };

    if (!open) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

            <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 p-6">

                <div className="flex items-center justify-between mb-6">

                    <h2 className="text-xl font-semibold text-white">

                        Invite Developer

                    </h2>

                    <button

                        onClick={onClose}

                        className="text-slate-400 hover:text-white"

                    >

                        ✕

                    </button>

                </div>

                <input

                    value={query}

                    onChange={e =>
                        setQuery(e.target.value)
                    }

                    placeholder="Search developers..."

                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"

                />

                <div className="mt-6 max-h-96 overflow-y-auto space-y-3">

                    {

                        loading && (

                            <p className="text-slate-400">

                                Searching...

                            </p>

                        )

                    }

                    {

                        !loading &&

                        users.length === 0 &&

                        query && (

                            <p className="text-slate-500">

                                No developers found.

                            </p>

                        )

                    }

                    {

                        users.map(user => (

                            <div

                                key={user._id}

                                className="flex items-center justify-between rounded-xl bg-slate-800 p-4"

                            >

                                <div className="flex items-center gap-4">

                                    <img

                                        src={user.avatar}

                                        alt={user.username}

                                        className="h-12 w-12 rounded-full object-cover"

                                    />

                                    <div>

                                        <h3 className="text-white">

                                            {user.fullName}

                                        </h3>

                                        <p className="text-sm text-slate-400">

                                            @{user.username}

                                        </p>

                                    </div>

                                </div>

                                <button

                                    disabled={
                                        inviting === user._id
                                    }

                                    onClick={() =>
                                        handleInvite(user._id)
                                    }

                                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-50"

                                >

                                    {

                                        inviting === user._id

                                            ?

                                            "Inviting..."

                                            :

                                            "Invite"

                                    }

                                </button>

                            </div>

                        ))

                    }

                </div>

            </div>

        </div>

    );

}

export default InviteMemberModal;