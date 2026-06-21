import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createProject } from "../../services/projectService";

function CreateProject() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [githubLink, setGithubLink] = useState("");
    const [liveDemoLink, setLiveDemoLink] = useState("");
    const [techStack, setTechStack] = useState("");

    const [images, setImages] = useState([]);

    const [loading, setLoading] = useState(false);
    const imagePreviews = images.map((image) =>
        URL.createObjectURL(image)
    );

    const inputClass = `w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 
    text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition`

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append(
                "title",
                title
            );

            formData.append(
                "description",
                description
            );

            formData.append(
                "category",
                category
            );

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

                    formData.append(
                        "techStack",
                        tech.trim()
                    );

                });

            images.forEach((image) => {

                formData.append(
                    "images",
                    image
                );

            });

            const response =
                await createProject(formData);

            console.log(response.data);

            alert("Project Created Successfully");

            navigate("/projects");

        } catch (error) {

            console.log(error);

            alert(
                error?.response?.data?.message ||
                "Failed to create project"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="space-y-8">

            {/* Header */}

            <div>
                <h1 className="text-5xl font-bold text-white">
                    Create Project
                </h1>

                <p className="text-slate-400 mt-2">
                    Showcase your project to the DevLink community
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Form Section */}

                <div className="lg:col-span-2">

                    <form
                        onSubmit={handleSubmit}
                        className="
          bg-slate-900/50
          backdrop-blur-xl
          border
          border-blue-500/10
          rounded-2xl
          p-8
          space-y-5
          "
                    >

                        {/* Title */}

                        <div>
                            <label className="block mb-2 text-slate-300">
                                Project Title
                            </label>

                            <input
                                type="text"
                                placeholder="Enter project title"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                className="
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
              focus:border-blue-500
              "
                                required
                            />
                        </div>

                        {/* Description */}

                        <div>
                            <label className="block mb-2 text-slate-300">
                                Description
                            </label>

                            <textarea
                                placeholder="Describe your project..."
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                rows={6}
                                className="
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
              focus:border-blue-500
              "
                                required
                            />
                        </div>

                        {/* Category */}

                        <div>
                            <label className="block mb-2 text-slate-300">
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                                className="
              w-full
              bg-slate-950/50
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
              focus:outline-none
              focus:border-blue-500
              "
                                required
                            >
                                <option value="">
                                    Select Category
                                </option>

                                <option value="Web Development">
                                    Web Development
                                </option>

                                <option value="Mobile Development">
                                    Mobile Development
                                </option>

                                <option value="AI/ML">
                                    AI/ML
                                </option>

                                <option value="Blockchain">
                                    Blockchain
                                </option>

                                <option value="Open Source">
                                    Open Source
                                </option>

                                <option value="Game Development">
                                    Game Development
                                </option>

                                <option value="Cybersecurity">
                                    Cybersecurity
                                </option>

                                <option value="DevOps">
                                    DevOps
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>
                        </div>

                        {/* Tech Stack */}

                        <div>
                            <label className="block mb-2 text-slate-300">
                                Tech Stack
                            </label>

                            <input
                                type="text"
                                placeholder="React, Node.js, MongoDB"
                                value={techStack}
                                onChange={(e) =>
                                    setTechStack(e.target.value)
                                }
                                className="
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
              focus:border-blue-500
              "
                                required
                            />
                        </div>

                        {/* Github */}

                        <div>
                            <label className="block mb-2 text-slate-300">
                                Github Repository
                            </label>

                            <input
                                type="url"
                                placeholder="https://github.com/..."
                                value={githubLink}
                                onChange={(e) =>
                                    setGithubLink(e.target.value)
                                }
                                className="
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
              focus:border-blue-500
              "
                            />
                        </div>

                        {/* Demo */}

                        <div>
                            <label className="block mb-2 text-slate-300">
                                Live Demo
                            </label>

                            <input
                                type="url"
                                placeholder="https://your-project.com"
                                value={liveDemoLink}
                                onChange={(e) =>
                                    setLiveDemoLink(e.target.value)
                                }
                                className="
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
              focus:border-blue-500
              "
                            />
                        </div>

                        {/* Upload */}

                        <div>
                            <label className="block mb-3 text-slate-300">
                                Project Images
                            </label>

                            <label
                                className="
              flex
              flex-col
              items-center
              justify-center
              h-40
              border-2
              border-dashed
              border-slate-700
              rounded-xl
              cursor-pointer
              hover:border-blue-500
              transition
              "
                            >
                                <p className="text-slate-400">
                                    Click to upload project images
                                </p>

                                <p className="text-xs text-slate-500 mt-2">
                                    PNG, JPG, WEBP
                                </p>

                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        setImages(
                                            Array.from(e.target.files)
                                        )
                                    }
                                />
                            </label>
                        </div>

                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
            w-full
            py-4
            rounded-xl
            bg-blue-600
            hover:bg-blue-500
            text-white
            font-semibold
            transition
            shadow-[0_0_25px_rgba(37,99,235,0.3)]
            disabled:opacity-50
            "
                        >
                            {loading
                                ? "Creating..."
                                : "Create Project"}
                        </button>

                    </form>

                </div>

                {/* Preview Section */}

                <div
                    className="
        bg-slate-900/50
        backdrop-blur-xl
        border
        border-blue-500/10
        rounded-2xl
        p-6
        h-fit
        sticky
        top-8
        "
                >

                    <h3 className="text-xl font-semibold text-white mb-4">
                        Project Preview
                    </h3>

                    <div className="space-y-4">

                        <div
  className="
  relative
  h-48
  rounded-xl
  overflow-hidden
  bg-slate-800
  "
>

  {images.length > 0 ? (
    <>
      <img
        src={URL.createObjectURL(images[0])}
        alt="preview"
        className="
        w-full
        h-full
        object-cover
        transition
        duration-500
        "
      />

      <div
        className="
        absolute
        inset-0
        bg-gradient-to-t
        from-black/70
        via-black/20
        to-transparent
        "
      />
    </>
  ) : (
    <div
      className="
      h-full
      flex
      items-center
      justify-center
      text-slate-500
      "
    >
      No Image Selected
    </div>
  )}

</div>

                        <h2 className="text-white text-xl font-bold">
                            {title || "Project Title"}
                        </h2>

                        <p className="text-slate-400">
                            {description ||
                                "Project description"}
                        </p>

                        <div className="flex flex-wrap gap-2">

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

                        <span
                            className="
            inline-block
            px-3
            py-1
            rounded-full
            bg-purple-500/20
            text-purple-300
            text-sm
            "
                        >
                            {category || "Category"}
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default CreateProject;