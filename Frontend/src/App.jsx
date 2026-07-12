import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import AppRoutes from "./routes/AppRoutes";
import useAuth from "./hooks/useAuth";

import DevLinkLoader from "./components/loader/DevLinkLoader";


function App() {

    useAuth();

    const { loading, authLoading } = useSelector(

        state => state.auth

    );

    const [minimumTimeElapsed, setMinimumTimeElapsed] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {

        if (loading || authLoading) {

            setShowLoader(true);

            return;

        }

        const timer = setTimeout(() => {

            setShowLoader(false);

        }, 1800); 

        return () => clearTimeout(timer);

    }, [loading, authLoading]);

    if (showLoader) {

        return (
            <DevLinkLoader progress={100} />
        );

    }

    return <AppRoutes />;


}

export default App;