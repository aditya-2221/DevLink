import { useState } from "react";
import { useDispatch } from "react-redux";

import EditProfileForm from "../forms/EditProfileForm";
import SocialLinksForm from "../forms/SocialLinksForm";

import {
    updateProfile,
    updateAvatar,
    updateCoverImage,
} from "../../services/authService";

import { setUser } from "../../features/auth/authSlice";

function EditProfileModal({
    user,
    onClose,
    type,
}) {

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const handleUpdate = async (data) => {

        try {

            setLoading(true);

            const {
                avatarFile,
                coverImageFile,
                ...profileData
            } = data;


            const profileResponse =
                await updateProfile(profileData);

            let updatedUser =
                profileResponse.data.data;

            if (avatarFile) {

                const avatarResponse =
                    await updateAvatar(
                        avatarFile
                    );

                updatedUser = {
                    ...updatedUser,
                    avatar:
                        avatarResponse.data.data.avatar,
                };

            }


            if (coverImageFile) {

                const coverResponse =
                    await updateCoverImage(
                        coverImageFile
                    );

                updatedUser = {
                    ...updatedUser,
                    coverImage:
                        coverResponse.data.data.coverImage,
                };

            }

            dispatch(
                setUser(updatedUser)
            );

            onClose();

        }
        catch (error) {

            console.error(error);

            alert(
                error?.response?.data?.message ||
                "Failed to update profile."
            );

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <div
            className="
            fixed
            inset-0
            bg-black/60
            flex
            items-center
            justify-center
            z-50
            "
        >

            <div
                className="
                w-full
                max-w-2xl
                max-h-[90vh]
                overflow-y-auto
                scrollbar-thin
                scrollbar-thumb-slate-700
                scrollbar-track-transparent
                bg-slate-950
                border
                border-slate-800
                rounded-3xl
                p-6
                "
            >

                <div
                    className="
                    flex
                    justify-between
                    items-center
                    mb-6
                    "
                >

                    <h2
                        className="
                        text-2xl
                        font-bold
                        text-white
                        "
                    >
                        {
                            type === "socials"
                                ? "Link Profiles"
                                : "Edit Profile"
                        }
                    </h2>

                    <button
                        onClick={onClose}
                        className="
                        text-slate-400
                        hover:text-white
                        transition
                        "
                    >
                        ✕
                    </button>

                </div>

                {

                    type === "socials"

                        ? (

                            <SocialLinksForm
                                user={user}
                                onSubmit={handleUpdate}
                                loading={loading}
                            />

                        )

                        : (

                            <EditProfileForm
                                user={user}
                                onSubmit={handleUpdate}
                                loading={loading}
                            />

                        )

                }

            </div>

        </div>

    );

}

export default EditProfileModal;