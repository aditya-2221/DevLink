import { useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    Lock,
    Eye,
    EyeOff
} from "lucide-react";

import {
    resetPassword
} from "../../services/authService";

const ResetPassword = () => {

    const { token } = useParams();

    const navigate = useNavigate();

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!password.trim()) {

            return alert(
                "Password is required."
            );

        }

        if (password !== confirmPassword) {

            return alert(
                "Passwords do not match."
            );

        }

        try {

            setLoading(true);

            await resetPassword(
                token,
                password
            );

            alert(
                "Password updated successfully."
            );

            navigate("/login");

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Invalid or expired reset link."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-[#071224] flex items-center justify-center px-4">

            <div
                className="
                w-full

                max-w-md

                rounded-3xl

                bg-slate-900/70

                border

                border-slate-800

                p-8
                "
            >

                <div className="flex justify-center">

                    <div
                        className="
                        w-16

                        h-16

                        rounded-full

                        bg-cyan-500/10

                        flex

                        items-center

                        justify-center
                        "
                    >

                        <Lock
                            size={30}
                            className="text-cyan-400"
                        />

                    </div>

                </div>

                <h1
                    className="
                    text-3xl

                    font-bold

                    text-white

                    text-center

                    mt-6
                    "
                >

                    Reset Password

                </h1>

                <p
                    className="
                    text-slate-400

                    text-center

                    mt-2
                    "
                >

                    Enter your new password.

                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 mt-8"
                >

                    {/* Password */}

                    <div className="relative">

                        <input

                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }

                            value={password}

                            onChange={(e)=>

                                setPassword(
                                    e.target.value
                                )

                            }

                            placeholder="New Password"

                            className="
                            w-full

                            rounded-xl

                            bg-slate-950/60

                            border

                            border-slate-700

                            px-4

                            py-3

                            pr-12

                            text-white

                            outline-none

                            focus:border-cyan-500
                            "

                        />

                        <button

                            type="button"

                            onClick={()=>

                                setShowPassword(

                                    !showPassword

                                )

                            }

                            className="
                            absolute

                            right-4

                            top-1/2

                            -translate-y-1/2

                            text-slate-400
                            "

                        >

                            {

                                showPassword

                                    ?

                                    <EyeOff size={18} />

                                    :

                                    <Eye size={18} />

                            }

                        </button>

                    </div>

                    {/* Confirm Password */}

                    <div className="relative">

                        <input

                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }

                            value={confirmPassword}

                            onChange={(e)=>

                                setConfirmPassword(
                                    e.target.value
                                )

                            }

                            placeholder="Confirm Password"

                            className="
                            w-full

                            rounded-xl

                            bg-slate-950/60

                            border

                            border-slate-700

                            px-4

                            py-3

                            pr-12

                            text-white

                            outline-none

                            focus:border-cyan-500
                            "

                        />

                        <button

                            type="button"

                            onClick={()=>

                                setShowConfirmPassword(

                                    !showConfirmPassword

                                )

                            }

                            className="
                            absolute

                            right-4

                            top-1/2

                            -translate-y-1/2

                            text-slate-400
                            "

                        >

                            {

                                showConfirmPassword

                                    ?

                                    <EyeOff size={18} />

                                    :

                                    <Eye size={18} />

                            }

                        </button>

                    </div>

                    <button

                        disabled={loading}

                        className="
                        w-full

                        py-3

                        rounded-xl

                        bg-cyan-500

                        hover:bg-cyan-600

                        text-white

                        font-semibold

                        disabled:opacity-50
                        "

                    >

                        {

                            loading

                                ?

                                "Updating..."

                                :

                                "Reset Password"

                        }

                    </button>

                </form>

            </div>

        </div>

    );

};

export default ResetPassword;