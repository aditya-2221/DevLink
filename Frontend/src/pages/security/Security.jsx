import { useState } from "react";
import { useSelector,useDispatch } from "react-redux";

import { setUser } from "../../features/auth/authSlice";

import {
    Shield,
    Mail,
    Lock,
    Eye,
    EyeOff
} from "lucide-react";

import {
    updateEmail,
    changePassword
} from "../../services/authService";

const Security = () => {

    const { user } = useSelector(
        state => state.auth
    );
    const dispatch = useDispatch();

    const [email, setEmail] =
        useState("");

    const [emailPassword, setEmailPassword] =
        useState("");

    const [oldPassword, setOldPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loadingEmail, setLoadingEmail] =
        useState(false);

    const [loadingPassword, setLoadingPassword] =
        useState(false);

    const [showOld, setShowOld] =
        useState(false);

    const [showNew, setShowNew] =
        useState(false);

    const [showConfirm, setShowConfirm] =
        useState(false);

    const inputClass = `
        w-full

        bg-slate-950/50

        border
        border-slate-700

        rounded-xl

        px-4
        py-3

        text-white

        placeholder:text-slate-500

        focus:outline-none

        focus:border-cyan-500

        transition
    `;
    const handleEmailUpdate = async () => {

        if (!email.trim()) {

            return alert(
                "Enter a new email."
            );

        }

        if (!emailPassword.trim()) {

            return alert(
                "Enter your password."
            );

        }

        try {

            setLoadingEmail(true);

            const response = await updateEmail({
                email,
                password: emailPassword
            });

            dispatch(
                setUser(response.data.data)
            );

            alert("Email updated successfully.");

            setEmail("");
            setEmailPassword("");


        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to update email."

            );

        }

        finally {

            setLoadingEmail(false);

        }

    };
    const handlePasswordUpdate = async () => {

        if (

            !oldPassword ||

            !newPassword ||

            !confirmPassword

        ) {

            return alert(
                "Fill all password fields."
            );

        }

        if (

            newPassword !== confirmPassword

        ) {

            return alert(
                "Passwords do not match."
            );

        }

        try {

            setLoadingPassword(true);

            await changePassword({

                oldPassword,

                newPassword

            });

            alert(
                "Password updated successfully."
            );

            setOldPassword("");

            setNewPassword("");

            setConfirmPassword("");

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Password update failed."

            );

        }

        finally {

            setLoadingPassword(false);

        }

    };
    return (

        <div className="max-w-5xl mx-auto px-6 py-10">

            <div className="mb-10">

                <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">

                        <Shield
                            className="text-cyan-400"
                            size={24}
                        />

                    </div>

                    <div>

                        <h1 className="text-3xl font-bold text-white">

                            Security

                        </h1>

                        <p className="text-slate-400 mt-1">

                            Manage your account email and password.

                        </p>

                    </div>

                </div>

            </div>

            <div className="space-y-8">

                {/* Email Card */}

                <div
                    className="
            rounded-3xl

            border
            border-slate-800

            bg-slate-900/40

            backdrop-blur-xl

            p-8
            "
                >

                    <div className="flex items-center gap-3 mb-8">

                        <Mail
                            size={22}
                            className="text-cyan-400"
                        />

                        <h2 className="text-xl font-semibold text-white">

                            Update Email

                        </h2>

                    </div>

                    <div className="space-y-6">

                        <div>

                            <label className="text-sm text-slate-400">

                                Current Email

                            </label>

                            <input

                                disabled

                                value={user?.email || ""}

                                className={`${inputClass} opacity-70 mt-2`}

                            />

                        </div>

                        <div>

                            <label className="text-sm text-slate-400">

                                New Email

                            </label>

                            <input

                                type="email"

                                value={email}

                                onChange={(e) =>

                                    setEmail(
                                        e.target.value
                                    )

                                }

                                className={`${inputClass} mt-2`}

                                placeholder="Enter new email"

                            />

                        </div>

                        <div>

                            <label className="text-sm text-slate-400">

                                Confirm Password

                            </label>

                            <input

                                type="password"

                                value={emailPassword}

                                onChange={(e) =>

                                    setEmailPassword(
                                        e.target.value
                                    )

                                }

                                className={`${inputClass} mt-2`}

                                placeholder="Enter current password"

                            />

                        </div>

                        <div className="flex justify-end">

                            <button

                                onClick={handleEmailUpdate}

                                disabled={loadingEmail}

                                className="
                        px-6

                        py-3

                        rounded-xl

                        bg-cyan-500

                        hover:bg-cyan-600

                        text-white

                        font-medium

                        disabled:opacity-50

                        transition
                        "

                            >

                                {

                                    loadingEmail

                                        ?

                                        "Updating..."

                                        :

                                        "Update Email"

                                }

                            </button>

                        </div>

                    </div>

                </div>

                {/* Password Card */}

                <div
                    className="
            rounded-3xl

            border
            border-slate-800

            bg-slate-900/40

            backdrop-blur-xl

            p-8
            "
                >

                    <div className="flex items-center gap-3 mb-8">

                        <Lock
                            size={22}
                            className="text-cyan-400"
                        />

                        <h2 className="text-xl font-semibold text-white">

                            Change Password

                        </h2>

                    </div>
                    <div className="space-y-6">

                        {/* Old Password */}

                        <div>

                            <label className="text-sm text-slate-400">

                                Current Password

                            </label>

                            <div className="relative mt-2">

                                <input

                                    type={
                                        showOld
                                            ? "text"
                                            : "password"
                                    }

                                    value={oldPassword}

                                    onChange={(e) =>
                                        setOldPassword(
                                            e.target.value
                                        )
                                    }

                                    className={`${inputClass} pr-12`}

                                    placeholder="Current password"

                                />

                                <button

                                    type="button"

                                    onClick={() =>
                                        setShowOld(
                                            !showOld
                                        )
                                    }

                                    className="
                            absolute

                            right-4

                            top-1/2

                            -translate-y-1/2

                            text-slate-400

                            hover:text-white
                            "

                                >

                                    {

                                        showOld

                                            ?

                                            <EyeOff size={18} />

                                            :

                                            <Eye size={18} />

                                    }

                                </button>

                            </div>

                        </div>

                        {/* New Password */}

                        <div>

                            <label className="text-sm text-slate-400">

                                New Password

                            </label>

                            <div className="relative mt-2">

                                <input

                                    type={
                                        showNew
                                            ? "text"
                                            : "password"
                                    }

                                    value={newPassword}

                                    onChange={(e) =>
                                        setNewPassword(
                                            e.target.value
                                        )
                                    }

                                    className={`${inputClass} pr-12`}

                                    placeholder="New password"

                                />

                                <button

                                    type="button"

                                    onClick={() =>
                                        setShowNew(
                                            !showNew
                                        )
                                    }

                                    className="
                            absolute

                            right-4

                            top-1/2

                            -translate-y-1/2

                            text-slate-400

                            hover:text-white
                            "

                                >

                                    {

                                        showNew

                                            ?

                                            <EyeOff size={18} />

                                            :

                                            <Eye size={18} />

                                    }

                                </button>

                            </div>

                        </div>

                        {/* Confirm Password */}

                        <div>

                            <label className="text-sm text-slate-400">

                                Confirm Password

                            </label>

                            <div className="relative mt-2">

                                <input

                                    type={
                                        showConfirm
                                            ? "text"
                                            : "password"
                                    }

                                    value={confirmPassword}

                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }

                                    className={`${inputClass} pr-12`}

                                    placeholder="Confirm password"

                                />

                                <button

                                    type="button"

                                    onClick={() =>
                                        setShowConfirm(
                                            !showConfirm
                                        )
                                    }

                                    className="
                            absolute

                            right-4

                            top-1/2

                            -translate-y-1/2

                            text-slate-400

                            hover:text-white
                            "

                                >

                                    {

                                        showConfirm

                                            ?

                                            <EyeOff size={18} />

                                            :

                                            <Eye size={18} />

                                    }

                                </button>

                            </div>

                        </div>

                        {/* Password Strength */}

                        <div>

                            <div className="flex justify-between text-sm mb-2">

                                <span className="text-slate-400">

                                    Password Strength

                                </span>

                                <span
                                    className={`
                                font-medium

                                ${newPassword.length >= 12

                                            ?

                                            "text-green-400"

                                            : newPassword.length >= 8

                                                ?

                                                "text-yellow-400"

                                                :

                                                "text-red-400"
                                        }
                            `}
                                >

                                    {

                                        newPassword.length >= 12

                                            ?

                                            "Strong"

                                            : newPassword.length >= 8

                                                ?

                                                "Medium"

                                                :

                                                "Weak"

                                    }

                                </span>

                            </div>

                            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">

                                <div

                                    className={`
                                h-full

                                transition-all

                                duration-300

                                ${newPassword.length >= 12

                                            ?

                                            "w-full bg-green-500"

                                            : newPassword.length >= 8

                                                ?

                                                "w-2/3 bg-yellow-500"

                                                :

                                                "w-1/3 bg-red-500"
                                        }
                            `}

                                />

                            </div>

                        </div>

                        <div className="flex justify-end">

                            <button

                                onClick={handlePasswordUpdate}

                                disabled={loadingPassword}

                                className="
                        px-6

                        py-3

                        rounded-xl

                        bg-cyan-500

                        hover:bg-cyan-600

                        text-white

                        font-medium

                        disabled:opacity-50

                        transition
                        "

                            >

                                {

                                    loadingPassword

                                        ?

                                        "Updating..."

                                        :

                                        "Update Password"

                                }

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Security;