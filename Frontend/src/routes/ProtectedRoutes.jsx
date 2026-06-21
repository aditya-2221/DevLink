import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {


    const {
        isAuthenticated,
        loading
    } = useSelector(
        state => state.auth
    );


    if (loading) {
        return <h1>Loading...</h1>;
    }

    return isAuthenticated
        ? children
        : <Navigate to="/login" />;
}

export default ProtectedRoute;