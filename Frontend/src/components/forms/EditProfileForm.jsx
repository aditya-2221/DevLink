import { useState, useMemo } from "react";

import {
    Camera,
    Plus,
    Trash2,
    Save,
    User,
    GraduationCap
} from "lucide-react";

import {
    FaGithub,
    FaLinkedin,
    FaGlobe,
    FaCode,
    FaMapMarkerAlt
} from "react-icons/fa";

function EditProfileForm({
    user,
    onSubmit,
    loading
}) {

    const [formData, setFormData] = useState({

        fullName: user?.fullName || "",

        bio: user?.bio || "",

        location: user?.location || "",

        github: user?.github || "",

        linkedin: user?.linkedin || "",

        portfolio: user?.portfolio || "",

        skills: user?.skills || [],

        education:
            user?.education?.length
                ? user.education
                : [
                    {
                        institution: "",
                        degree: "",
                        fieldOfStudy: "",
                        startYear: "",
                        endYear: ""
                    }
                ]

    });

    const [skillInput, setSkillInput] = useState("");

    const [avatarFile, setAvatarFile] = useState(null);

    const [coverImageFile, setCoverImageFile] = useState(null);



    const avatarPreview = useMemo(() => {

        if (avatarFile) {
            return URL.createObjectURL(avatarFile);
        }

        return user?.avatar;

    }, [avatarFile, user]);



    const coverPreview = useMemo(() => {

        if (coverImageFile) {
            return URL.createObjectURL(coverImageFile);
        }

        return user?.coverImage;

    }, [coverImageFile, user]);



    const handleChange = (e) => {

        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

    };



    const addSkill = () => {

        const value = skillInput.trim();

        if (!value) return;

        if (formData.skills.includes(value)) {

            setSkillInput("");

            return;

        }

        setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, value]
        }));

        setSkillInput("");

    };



    const removeSkill = (skill) => {

        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }));

    };



    const handleEducationChange = (

        index,
        field,
        value

    ) => {

        const updated = [...formData.education];

        updated[index][field] = value;

        setFormData(prev => ({
            ...prev,
            education: updated
        }));

    };



    const addEducation = () => {

        setFormData(prev => ({
            ...prev,
            education: [
                ...prev.education,
                {
                    institution: "",
                    degree: "",
                    fieldOfStudy: "",
                    startYear: "",
                    endYear: ""
                }
            ]
        }));

    };



    const removeEducation = (index) => {

        setFormData(prev => ({
            ...prev,
            education: prev.education.filter(
                (_, i) => i !== index
            )
        }));

    };



    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit({
            ...formData,
            avatarFile,
            coverImageFile
        });

    };



    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-8"
        >

            {/* ---------------- Cover Image ---------------- */}

            <div className="space-y-3">

                <label className="text-sm font-semibold text-slate-300">

                    Cover Image

                </label>

                <div className="relative h-52 rounded-2xl overflow-hidden border border-slate-700">

                    <img
                        src={
                            coverPreview ||
                            "https://placehold.co/1200x400/0f172a/475569?text=Cover+Image"
                        }
                        alt=""
                        className="w-full h-full object-cover"
                    />

                    <label
                        className="
                        absolute
                        bottom-4
                        right-4
                        bg-black/70
                        hover:bg-black
                        p-3
                        rounded-full
                        cursor-pointer
                        transition
                        "
                    >

                        <Camera size={18} className="text-white" />

                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) =>
                                setCoverImageFile(
                                    e.target.files[0]
                                )
                            }
                        />

                    </label>

                </div>

            </div>



            {/* ---------------- Avatar ---------------- */}

            <div className="flex items-center gap-6">

                <div className="relative">

                    <img
                        src={
                            avatarPreview ||
                            "https://placehold.co/200x200"
                        }
                        alt=""
                        className="
                        h-28
                        w-28
                        rounded-full
                        object-cover
                        border-4
                        border-slate-700
                        "
                    />

                    <label
                        className="
                        absolute
                        bottom-0
                        right-0
                        bg-blue-600
                        hover:bg-blue-500
                        rounded-full
                        p-2
                        cursor-pointer
                        transition
                        "
                    >

                        <Camera
                            size={16}
                            className="text-white"
                        />

                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) =>
                                setAvatarFile(
                                    e.target.files[0]
                                )
                            }
                        />

                    </label>

                </div>

                <div>

                    <h2 className="text-xl font-semibold text-white">

                        Profile Picture

                    </h2>

                    <p className="text-sm text-slate-400 mt-1">

                        JPG, PNG or WEBP

                    </p>

                    <p className="text-sm text-slate-500">

                        Recommended 512 × 512

                    </p>

                </div>

            </div>

                       {/* ---------------- Personal Information ---------------- */}

            <div className="space-y-6">

                <div>

                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                        <User size={16} />
                        Full Name
                    </label>

                    <input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 outline-none"
                    />

                </div>


                <div>

                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                        Bio
                    </label>

                    <textarea
                        rows={4}
                        name="bio"
                        maxLength={150}
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell everyone about yourself..."
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white resize-none focus:border-blue-500 outline-none"
                    />

                    <p className="text-xs text-slate-500 mt-2 text-right">
                        {formData.bio.length}/150
                    </p>

                </div>


                <div>

                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                        <FaMapMarkerAlt size={16} />
                        Location
                    </label>

                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 outline-none"
                    />

                </div>

            </div>



           



            {/* ---------------- Skills ---------------- */}

            <div className="space-y-4">

                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">

                    <FaCode size={16} />

                    Skills

                </label>

                <div className="flex gap-3">

                    <input
                        value={skillInput}
                        onChange={(e) =>
                            setSkillInput(e.target.value)
                        }
                        placeholder="React"
                        className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />

                    <button
                        type="button"
                        onClick={addSkill}
                        className="px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition"
                    >
                        <Plus size={18} />
                    </button>

                </div>

                <div className="flex flex-wrap gap-3">

                    {formData.skills.map((skill) => (

                        <div
                            key={skill}
                            className="flex items-center gap-2 bg-slate-800 text-slate-200 px-4 py-2 rounded-full"
                        >

                            {skill}

                            <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                            >

                                <Trash2
                                    size={14}
                                    className="text-red-400"
                                />

                            </button>

                        </div>

                    ))}

                </div>

            </div>



            {/* ---------------- Education ---------------- */}

            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">

                <div className="flex justify-between items-center mb-6">

                    <h3 className="flex items-center gap-2 text-lg font-semibold text-white">

                        <GraduationCap size={20} />

                        Education

                    </h3>

                    <button
                        type="button"
                        onClick={addEducation}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
                    >

                        <Plus size={16} />

                        Add

                    </button>

                </div>

                <div className="space-y-6">

                    {formData.education.map((edu, index) => (

                        <div
                            key={index}
                            className="border border-slate-800 rounded-xl p-5 space-y-4"
                        >

                            <input
                                value={edu.institution}
                                onChange={(e) =>
                                    handleEducationChange(
                                        index,
                                        "institution",
                                        e.target.value
                                    )
                                }
                                placeholder="Institution"
                                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
                            />

                            <input
                                value={edu.degree}
                                onChange={(e) =>
                                    handleEducationChange(
                                        index,
                                        "degree",
                                        e.target.value
                                    )
                                }
                                placeholder="Degree"
                                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
                            />

                            <input
                                value={edu.fieldOfStudy}
                                onChange={(e) =>
                                    handleEducationChange(
                                        index,
                                        "fieldOfStudy",
                                        e.target.value
                                    )
                                }
                                placeholder="Field of Study"
                                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
                            />

                            <div className="grid grid-cols-2 gap-4">

                                <input
                                    type="number"
                                    value={edu.startYear}
                                    onChange={(e) =>
                                        handleEducationChange(
                                            index,
                                            "startYear",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Start Year"
                                    className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
                                />

                                <input
                                    type="number"
                                    value={edu.endYear}
                                    onChange={(e) =>
                                        handleEducationChange(
                                            index,
                                            "endYear",
                                            e.target.value
                                        )
                                    }
                                    placeholder="End Year"
                                    className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
                                />

                            </div>

                            {formData.education.length > 1 && (

                                <button
                                    type="button"
                                    onClick={() => removeEducation(index)}
                                    className="text-red-400 hover:text-red-300"
                                >

                                    Remove Education

                                </button>

                            )}

                        </div>

                    ))}

                </div>

            </div>

                        <button
                type="submit"
                disabled={loading}
                className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                py-3
                rounded-xl
                bg-blue-600
                hover:bg-blue-500
                disabled:opacity-60
                disabled:cursor-not-allowed
                text-white
                font-semibold
                transition
                "
            >
                <Save size={18} />

                {
                    loading
                        ? "Saving Changes..."
                        : "Save Changes"
                }

            </button>

        </form>

    );

}

export default EditProfileForm;