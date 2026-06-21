import { useEffect, useState } from "react";
import {
    getComments,
    addComment,
    deleteComment
} from "../../services/projectService";

import { useDispatch, useSelector } from "react-redux";
import { setCurrentProject } from "../../features/projects/projectSlice";

function CommentSection({ projectId }) {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const { currentProject } = useSelector(
        (state) => state.projects
    );

    const { user } = useSelector(
        (state) => state.auth
    );

    const fetchComments = async () => {
        try {
            const response = await getComments(projectId);

            setComments(
                response.data.data.comments
            );
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [projectId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            return;
        }

        try {
            setLoading(true);

            const response = await addComment(
                projectId,
                { content }
            );

            setComments(prev => [
                response.data.data,
                ...prev
            ]);

            dispatch(
                setCurrentProject({
                    ...currentProject,
                    commentsCount:
                        currentProject.commentsCount + 1
                })
            );

            setContent("");


        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (
        commentId
    ) => {
        try {
            await deleteComment(commentId);

            setComments((prev) =>
                prev.filter(
                    (comment) =>
                        comment._id !== commentId
                )
            );

            dispatch(
                setCurrentProject({
                    ...currentProject,
                    commentsCount:
                        currentProject.commentsCount - 1
                })
            );
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="mt-10">

            <h2 className="text-2xl text-white font-bold mb-4">
                Comments
            </h2>

            <form
                onSubmit={handleSubmit}
                className="mb-6"
            >
                <textarea
                    value={content}
                    onChange={(e) =>
                        setContent(
                            e.target.value
                        )
                    }
                    placeholder="Write a comment..."
                    className="
                        w-full
                        p-3
                        text-slate-300
                        rounded-lg
                        bg-slate-900
                        border
                        border-slate-700
                    "
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="
                        mt-3
                        px-4
                        py-2
                        rounded-lg
                        bg-blue-600
                    "
                >
                    {loading
                        ? "Posting..."
                        : "Post Comment"}
                </button>
            </form>

            <div className="space-y-4">

                {comments.map(
                    (comment) => (
                        <div
                            key={comment._id}
                            className="
                                p-4
                                text-slate-200
                                rounded-lg
                                bg-slate-900
                            "
                        >
                            <div className="flex justify-between">

                                <div>

                                    <p className="font-semibold">
                                        @{comment.owner?.username}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {new Date(comment.createdAt)
                                            .toLocaleDateString()}
                                    </p>

                                    <p className="text-gray-300 mt-2">
                                        {comment.content}
                                    </p>

                                </div>

                                {comment.owner?._id === user?._id && (
                                    <button
                                        onClick={() =>
                                            handleDelete(comment._id)
                                        }
                                        className="text-red-500"
                                    >
                                        Delete
                                    </button>
                                )}

                            </div>
                        </div>
                    )
                )}

            </div>

        </div>
    );
}

export default CommentSection;