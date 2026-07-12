import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    logoutUser,
    setAuthLoading
} from "../features/auth/authSlice";

import {
    logoutUser as logoutApi
} from "../services/authService";

export default function useLogout() {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const logout = async () => {

        dispatch(setAuthLoading(true));

        try {

            await logoutApi();

        }

        catch (error) {

            console.error(error);

        }

        finally {

            dispatch(logoutUser());

            dispatch(setAuthLoading(false));

            navigate("/", {
                replace: true
            });

        }

    };

    return logout;

}