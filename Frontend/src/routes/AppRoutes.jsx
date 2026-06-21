import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/login/Login";
import AuthLayout from "../layouts/AuthLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Register from "../pages/register/Register";
import Projects from "../pages/projects/projects";
import CreateProject from "../pages/projects/CreateProject";
import ProjectDetails from "../pages/projects/ProjectDetails";
import Profile from "../pages/profile/Profile";
function AppRoutes() {

  return (
    <Routes>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />

        <Route path="/profile" element={<Profile />} />


        <Route path="/projects" element={<Projects />} />

        <Route
          path="/projects/create"
          element={<CreateProject />}
        />

        <Route
          path="/projects/:projectId"
          element={<ProjectDetails />}
        />
      </Route>




    </Routes>
  );
}

export default AppRoutes;