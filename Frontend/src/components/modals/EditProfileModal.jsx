import {
    useState
} from "react";

import {
    useDispatch
} from "react-redux";

import EditProfileForm
    from "../forms/EditProfileForm";

import {
    updateProfile
} from "../../services/authService";

import {
    setUser
} from "../../features/auth/authSlice";
import SocialLinksForm from "../forms/SocialLinksForm";
function EditProfileModal({
    user,
    onClose,
    type
}) {

    const dispatch =
        useDispatch();

    const [loading, setLoading] =
        useState(false);

    const handleUpdate =
        async (data) => {

            try {

                setLoading(true);

                const response =
                    await updateProfile(
                        data
                    );


                dispatch(
                    setUser(
                        response.data.data
                    )
                );


                onClose();

            } catch (error) {

                console.log(error);

            } finally {

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
                        onClick={
                            onClose
                        }
                        className="
                        text-slate-400
                        "
                    >
                        ✕
                    </button>

                </div>

                {
                    type === "socials" ? (

                        <SocialLinksForm
                            user={user}
                            onSubmit={
                                handleUpdate
                            }
                            loading={
                                loading
                            }
                        />

                    ) : (

                        <EditProfileForm
                            user={user}
                            onSubmit={
                                handleUpdate
                            }
                            loading={
                                loading
                            }
                        />

                    )
                }

            </div>

        </div>
    );
}

export default EditProfileModal;