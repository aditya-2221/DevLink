import { useState } from "react";
import { Link } from "react-router-dom";

import { Mail } from "lucide-react";

import { forgotPassword } from "../../services/authService";

const ForgotPassword = () => {

    const [email, setEmail] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [success, setSuccess] =
        useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!email.trim()) {

            return alert(
                "Enter your email."
            );

        }

        try {

            setLoading(true);

            await forgotPassword(email);

            setSuccess(true);

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Something went wrong."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-[#071224] px-4">

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

                <div className="flex justify-center mb-6">

                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center">

                        <Mail
                            size={30}
                            className="text-cyan-400"
                        />

                    </div>

                </div>

                <h1 className="text-3xl font-bold text-white text-center">

                    Forgot Password

                </h1>

                <p className="text-slate-400 text-center mt-3">

                    Enter your email and we'll send you a reset link.

                </p>

                {

                    success

                        ?

                        <div
                            className="
                            mt-8

                            rounded-xl

                            bg-green-500/10

                            border

                            border-green-500/20

                            p-4

                            text-green-400

                            text-center
                            "
                        >

                            If an account exists,

                            we've sent a password reset link.

                        </div>

                        :

                        <form
                            onSubmit={handleSubmit}
                            className="mt-8 space-y-6"
                        >

                            <input

                                type="email"

                                value={email}

                                onChange={(e)=>

                                    setEmail(
                                        e.target.value
                                    )

                                }

                                placeholder="Email address"

                                className="
                                w-full

                                px-4

                                py-3

                                rounded-xl

                                bg-slate-950/60

                                border

                                border-slate-700

                                text-white

                                focus:border-cyan-500

                                outline-none
                                "

                            />

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

                                        "Sending..."

                                        :

                                        "Send Reset Link"

                                }

                            </button>

                        </form>

                }

                <div className="mt-8 text-center">

                    <Link

                        to="/login"

                        className="text-cyan-400 hover:underline"

                    >

                        Back to Login

                    </Link>

                </div>

            </div>

        </div>

    );

};

export default ForgotPassword;