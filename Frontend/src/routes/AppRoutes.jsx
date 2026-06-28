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
import UserProfile from "../pages/profile/UserProfile";

import Recruitments from "../pages/recruitment/Recruitments";
import RecruitmentDetails from "../pages/recruitment/RecruitmentDetails";
import CreateRecruitment from "../pages/recruitment/CreateRecruitment";
import ManageApplications from "../pages/recruitment/ManageApplications";
import EditRecruitment from "../pages/recruitment/EditRecruitment";

import Teams from "../pages/teams/Teams";
import CreateTeam from "../pages/teams/CreateTeam";
import TeamDetails from "../pages/teams/TeamDetails";
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
        <Route path="/profile/:username" element={<UserProfile />} />


        <Route path="/projects" element={<Projects />} />

        <Route
          path="/projects/create"
          element={<CreateProject />}
        />

        <Route
          path="/projects/:projectId"
          element={<ProjectDetails />}
        />
        <Route
          path="/recruitments"
          element={<Recruitments />}
        />

        <Route
          path="/recruitments/create"
          element={<CreateRecruitment />}
        />

        <Route
          path="/recruitments/:recruitmentId"
          element={<RecruitmentDetails />}
        />

        <Route
          path="/recruitments/:recruitmentId/applications"
          element={<ManageApplications />}
        />

        <Route
          path="/recruitments/:recruitmentId/edit"
          element={<EditRecruitment />}
        />
        <Route
          path="/teams"
          element={<Teams />}
        />
        <Route
          path="/teams/:teamId"
          element={<TeamDetails />}
        />
        <Route
          path="/teams/create"
          element={<CreateTeam />}
        />
      </Route>




    </Routes>
  );
}

export default AppRoutes;