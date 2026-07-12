import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { loginUser } from "../../services/authService"
import {
    setUser,
    setAuthLoading
} from "../../features/auth/authSlice";

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [loginField, setLoginField] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!loginField || !password) {
            alert("Please fill all fields")
            return
        }

        try {
            setLoading(true);

            dispatch(
                setAuthLoading(true)
            );

            const response = await loginUser({
                email: loginField.includes("@") ? loginField.toLowerCase() : undefined,
                username: !loginField.includes("@") ? loginField.toLowerCase() : undefined,
                password,
            })

            dispatch(
                setUser(response.data.data.user)
            )

            navigate("/")

        } catch (error) {

            console.log(error.response?.data);

            alert(
                error?.response?.data?.message || "Login failed"
            )

        } finally {
            setLoading(false);

            dispatch(
                setAuthLoading(false)
            );
        }
    };



    return (
        <div className="w-full text-left">
            {/* Tabs */}
            <div className="grid grid-cols-2 border-b border-white/10 mb-12 text-center">

                <Link
                    to="/login"
                    className="pb-4 text-lg font-semibold text-white border-b-2 border-blue-500 flex justify-center"
                >
                    Login
                </Link>

                <Link
                    to="/register"
                    className="pb-4 text-lg text-gray-400 flex justify-center hover:text-white transition"
                >
                    Sign Up
                </Link>

            </div>

            {/* Heading */}
            <div className="mb-10">
                <h3 className="text-4xl font-bold text-white mb-3">
                    Welcome back!
                </h3>

                <p className="text-base text-gray-400">
                    Login to continue to your DevLink account.
                </p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email or Username
                    </label>

                    <div className="relative">
                        <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </span>

                        <input
                            type="text"
                            value={loginField}
                            onChange={(e) => setLoginField(e.target.value)}
                            placeholder="Enter your email or username"
                            className="w-full pl-12 pr-4 py-4 bg-[#0B1225] border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 shadow-inner transition-all"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-300">
                            Password
                        </label>

                        <Link

                            to="/forgot-password"

                            className="
    text-sm

    text-cyan-400

    hover:text-cyan-300

    transition
    "

                        >

                            Forgot Password?

                        </Link>
                    </div>

                    <div className="relative">
                        <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </span>

                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full pl-12 pr-12 py-4 bg-[#0B1225] border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 shadow-inner transition-all"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-300"
                        >
                            {showPassword ? (
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 3l18 18"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>



                {/* Login Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}

                    {!loading && (
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                        </svg>
                    )}
                </button>
                {/* Divider */}
                <div className="relative flex items-center py-3">
                    <div className="flex-grow border-t border-white/10"></div>

                    <span className="mx-4 text-xs text-gray-500 uppercase tracking-wider">
                        or continue with
                    </span>

                    <div className="flex-grow border-t border-white/10"></div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-3 gap-3">
                    <button
                        type="button"
                        className="py-4 rounded-xl bg-[#0B1225] border border-white/10 text-sm text-gray-300 hover:border-blue-500 transition"
                    >
                        GitHub
                    </button>

                    <button
                        type="button"
                        className="py-4 rounded-xl bg-[#0B1225] border border-white/10 text-sm text-gray-300 hover:border-blue-500 transition"
                    >
                        Google
                    </button>

                    <button
                        type="button"
                        className="py-4 rounded-xl bg-[#0B1225] border border-white/10 text-sm text-gray-300 hover:border-blue-500 transition"
                    >
                        Discord
                    </button>
                </div>

                {/* Signup */}
                <div className="text-center pt-6">
                    <p className="text-sm text-gray-500">
                        Don't have an account?

                        <a
                            href="#signup"
                            className="ml-2 text-blue-400 font-medium hover:underline"
                        >
                            Sign up
                        </a>
                    </p>
                </div>
            </form>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-gray-500">
                Your data is secure with us. Read our{" "}
                <a href="#" className="text-blue-400 hover:underline">
                    Privacy Policy
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-400 hover:underline">
                    Terms of Service
                </a>
            </div>
        </div>
    );
};

export default LoginForm;