import { useState } from "react";
import { registerUser } from "../../services/authService";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Register() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("fullName", fullName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      const response = await registerUser(formData);

      console.log("REGISTER SUCCESS");
      console.log(response.data);

      alert("Registration Successful");

      navigate("/login");

    } catch (error) {
      console.log(error.response?.data || error);

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-left">

      {/* Tabs */}
      <div className="grid grid-cols-2 border-b border-white/10 mb-10 text-center">
        <Link
          to="/login"
          className="pb-4 text-lg text-gray-400"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="pb-4 text-lg font-semibold text-white border-b-2 border-blue-500"
        >
          Sign Up
        </Link>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h3 className="text-4xl font-bold text-white mb-3">
          Create Account
        </h3>

        <p className="text-gray-400">
          Join DevLink and start building amazing projects.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleRegister}
        className="space-y-5"
      >

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-4 bg-[#0B1225] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-4 bg-[#0B1225] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-4 bg-[#0B1225] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-4 bg-[#0B1225] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />

        {/* Avatar Upload */}
        <label className="
      block
      w-full
      p-4
      rounded-2xl
      border
      border-dashed
      border-white/20
      text-center
      text-gray-400
      cursor-pointer
      hover:border-blue-500
      transition-all
    ">
          {avatar ? avatar.name : "Upload Avatar *"}

          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="
        w-full
        py-4
        rounded-2xl
        bg-gradient-to-r
        from-blue-600
        via-blue-500
        to-purple-600
        text-white
        font-semibold
        text-lg
        hover:opacity-90
        disabled:opacity-50
      "
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Bottom Link */}
        <div className="text-center pt-2">
          <p className="text-sm text-gray-500">
            Already have an account?

            <Link
              to="/login"
              className="ml-2 text-blue-400 font-medium"
            >
              Login
            </Link>
          </p>
        </div>

      </form>

    </div>
  );
}

export default Register;