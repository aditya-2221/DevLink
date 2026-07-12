import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getProjectById,
    updateProject
} from "../../services/projectService";

function EditProject() {

    const { projectId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    const [githubLink, setGithubLink] = useState("");
    const [liveDemoLink, setLiveDemoLink] = useState("");

    const [techStack, setTechStack] = useState("");

    const [existingImages, setExistingImages] =
        useState([]);

    const [newImages, setNewImages] =
        useState([]);

    const inputClass = `
        w-full
        rounded-xl
        border
        border-slate-700
        bg-slate-950/50
        px-4
        py-3
        text-white
        placeholder:text-slate-500
        focus:border-blue-500
        focus:outline-none
        transition
    `;

    useEffect(() => {

        const fetchProject = async () => {

            try {

                const response =
                    await getProjectById(projectId);

                const project =
                    response.data.data;

                setTitle(project.title);

                setDescription(
                    project.description
                );

                setCategory(
                    project.category
                );

                setGithubLink(
                    project.githubLink || ""
                );

                setLiveDemoLink(
                    project.liveDemoLink || ""
                );

                setTechStack(
                    project.techStack.join(", ")
                );

                setExistingImages(
                    project.images || []
                );

            }

            catch (error) {

                alert(
                    error.response?.data?.message ||
                    "Unable to load project."
                );

                navigate("/projects");

            }

            finally {

                setFetching(false);

            }

        };

        fetchProject();

    }, [projectId, navigate]);

    const imagePreviews =
        newImages.map((image) =>
            URL.createObjectURL(image)
        );

    if (fetching) {

        return (

            <div
                className="
                min-h-[60vh]
                flex
                items-center
                justify-center
                text-white
                text-xl
                "
            >
                Loading project...
            </div>

        );

    }
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append("title", title);
            formData.append("description", description);
            formData.append("category", category);

            formData.append(
                "githubLink",
                githubLink
            );

            formData.append(
                "liveDemoLink",
                liveDemoLink
            );

            techStack
                .split(",")
                .forEach((tech) => {

                    if (tech.trim()) {

                        formData.append(
                            "techStack",
                            tech.trim()
                        );

                    }

                });

            newImages.forEach((image) => {

                formData.append(
                    "images",
                    image
                );

            });

            await updateProject(
                projectId,
                formData
            );

            alert(
                "Project updated successfully."
            );

            navigate(
                `/projects/${projectId}`
            );

        }

        catch (error) {

            console.error(error);

            alert(

                error.response?.data?.message ||

                "Failed to update project."

            );

        }

        finally {

            setLoading(false);

        }

    };
    const categories = [

        "Web Development",

        "Mobile Development",

        "AI/ML",

        "Blockchain",

        "Open Source",

        "Game Development",

        "Cybersecurity",

        "DevOps",

        "Other"

    ];
    return (

        <div className="max-w-7xl mx-auto p-8">

            {/* Header */}

            <div className="mb-10">

                <h1
                    className="
                    text-5xl
                    font-bold
                    text-white
                    "
                >
                    Edit Project
                </h1>

                <p
                    className="
                    mt-3
                    text-slate-400
                    "
                >
                    Update your project details and keep your showcase up to date.
                </p>

            </div>

            <div
                className="
                grid
                lg:grid-cols-3
                gap-8
                "
            >

                {/* Left Side */}

                <div
                    className="
                    lg:col-span-2
                    space-y-6
                    "
                >

                    <form
                        onSubmit={handleSubmit}
                        className="
                        rounded-2xl
                        border
                        border-blue-500/10
                        bg-slate-900/50
                        backdrop-blur-xl
                        p-8
                        space-y-6
                        "
                    >
                        <div>

                            <label
                                className="
                                block
                                mb-2
                                text-slate-300
                                "
                            >
                                Project Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                                className={inputClass}
                                required
                            />

                        </div>
                        <div>

                            <label
                                className="
                                block
                                mb-2
                                text-slate-300
                                "
                            >
                                Description
                            </label>

                            <textarea
                                rows={6}
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                className={inputClass}
                                required
                            />

                        </div>
                        <div>

                            <label
                                className="
                                block
                                mb-2
                                text-slate-300
                                "
                            >
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value
                                    )
                                }
                                className={inputClass}
                            >

                                {categories.map((cat) => (

                                    <option
                                        key={cat}
                                        value={cat}
                                    >
                                        {cat}
                                    </option>

                                ))}

                            </select>

                        </div>
                        {/* Tech Stack */}

                        <div>

                            <label className="block mb-2 text-slate-300">
                                Tech Stack
                            </label>

                            <input
                                type="text"
                                value={techStack}
                                onChange={(e) =>
                                    setTechStack(e.target.value)
                                }
                                placeholder="React, Node.js, MongoDB..."
                                className={inputClass}
                            />

                        </div>

                        {/* GitHub */}

                        <div>

                            <label className="block mb-2 text-slate-300">
                                GitHub Repository
                            </label>

                            <input
                                type="url"
                                value={githubLink}
                                onChange={(e) =>
                                    setGithubLink(e.target.value)
                                }
                                className={inputClass}
                            />

                        </div>

                        {/* Live Demo */}

                        <div>

                            <label className="block mb-2 text-slate-300">
                                Live Demo
                            </label>

                            <input
                                type="url"
                                value={liveDemoLink}
                                onChange={(e) =>
                                    setLiveDemoLink(e.target.value)
                                }
                                className={inputClass}
                            />

                        </div>

                        {/* Existing Images */}

                        <div>

                            <label className="block mb-3 text-slate-300">
                                Current Images
                            </label>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                                {existingImages.length > 0 ? (

                                    existingImages.map((image) => (

                                        <img
                                            key={image.public_id}
                                            src={image.url}
                                            alt=""
                                            className="
                                            h-32
                                            w-full
                                            object-cover
                                            rounded-xl
                                            border
                                            border-slate-700
                                            "
                                        />

                                    ))

                                ) : (

                                    <div className="text-slate-500">
                                        No Images
                                    </div>

                                )}

                            </div>

                        </div>

                        {/* Upload */}

                        <div>

                            <label className="block mb-3 text-slate-300">
                                Upload New Images
                            </label>

                            <label
                                className="
                                flex
                                flex-col
                                items-center
                                justify-center
                                h-40
                                rounded-xl
                                border-2
                                border-dashed
                                border-slate-700
                                cursor-pointer
                                hover:border-blue-500
                                transition
                                "
                            >

                                <p className="text-slate-400">
                                    Click to upload additional images
                                </p>

                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        setNewImages(
                                            Array.from(
                                                e.target.files
                                            )
                                        )
                                    }
                                />

                            </label>

                        </div>

                        {/* New Image Preview */}

                        {imagePreviews.length > 0 && (

                            <div>

                                <label className="block mb-3 text-slate-300">
                                    New Images
                                </label>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                                    {imagePreviews.map((image, index) => (

                                        <img
                                            key={index}
                                            src={image}
                                            alt=""
                                            className="
                                            h-32
                                            w-full
                                            object-cover
                                            rounded-xl
                                            border
                                            border-blue-500/20
                                            "
                                        />

                                    ))}

                                </div>

                            </div>

                        )}

                        {/* Buttons */}

                        <div className="flex justify-end gap-4 pt-6">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/projects/${projectId}`
                                    )
                                }
                                className="
                                px-6
                                py-3
                                rounded-xl
                                border
                                border-slate-700
                                text-slate-300
                                hover:bg-slate-800
                                transition
                                "
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                px-8
                                py-3
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-500
                                text-white
                                font-semibold
                                transition
                                disabled:opacity-50
                                "
                            >
                                {loading
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </form>

                </div>

                {/* Right Side */}

                <div
                    className="
                    rounded-2xl
                    border
                    border-blue-500/10
                    bg-slate-900/50
                    backdrop-blur-xl
                    p-6
                    h-fit
                    sticky
                    top-8
                    "
                >

                    <h3 className="text-xl font-semibold text-white mb-5">
                        Live Preview
                    </h3>

                    <div
                        className="
                        relative
                        h-56
                        rounded-xl
                        overflow-hidden
                        bg-slate-800
                        "
                    >

                        <img
                            src={
                                imagePreviews[0] ||
                                existingImages[0]?.url ||
                                "https://placehold.co/600x400"
                            }
                            alt=""
                            className="
                            h-full
                            w-full
                            object-cover
                            "
                        />

                    </div>

                    <h2 className="text-2xl font-bold text-white mt-5">
                        {title || "Project Title"}
                    </h2>

                    <p className="text-slate-400 mt-3">
                        {description ||
                            "Project description"}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-5">

                        {techStack
                            .split(",")
                            .filter(Boolean)
                            .map((tech) => (

                                <span
                                    key={tech}
                                    className="
                                    px-3
                                    py-1
                                    rounded-full
                                    bg-blue-500/20
                                    text-blue-300
                                    text-sm
                                    "
                                >
                                    {tech.trim()}
                                </span>

                            ))}

                    </div>

                    <div className="mt-5">

                        <span
                            className="
                            inline-block
                            rounded-full
                            bg-purple-500/20
                            px-3
                            py-1
                            text-sm
                            text-purple-300
                            "
                        >
                            {category}
                        </span>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default EditProject;