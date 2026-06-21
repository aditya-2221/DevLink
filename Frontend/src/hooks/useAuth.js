import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
    setUser,
    setAuthChecked
} from "../features/auth/authSlice";

import { getCurrentUser }
from "../services/authService";

export default function useAuth() {

    const dispatch = useDispatch();

    useEffect(() => {

        const checkAuth = async () => {

            try {

                const response =
                    await getCurrentUser();

                dispatch(
                    setUser(
                        response.data.data
                    )
                );

            } catch (error) {

                console.log(
                    "Not authenticated"
                );

            } finally {

                dispatch(
                    setAuthChecked()
                );

            }
        };

        checkAuth();

    }, [dispatch]);
}