import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileHeader from "../../components/ui/ProfileHeader";
import ProfileTabs from "../../components/ui/ProfileTabs";

import SkillsCard from "../../components/cards/SkillsCard";
import EducationCard from "../../components/cards/EducationCard";
import ProfileProjects from "../../components/cards/ProfileProjects";

import { getUserProfile } from "../../services/userService";

function UserProfile() {
    const { user: currentUser } = useSelector(
        state => state.auth
    );

    const { username } = useParams();

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] =
        useState(null);

    const [activeTab, setActiveTab] =
        useState("overview");

    const [stats, setStats] = useState({
        projects: 0,
        likes: 0,
        bookmarks: 0,
    });

    const isOwner = currentUser?.username === user?.username;

    const fetchProfile = async () => {

        try {

            setLoading(true);

            const response = await getUserProfile(username);
            console.log(
                "PROFILE RESPONSE",
                response.data.data
            );

            setUser(response.data.data);

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Failed to load profile"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        fetchProfile();

    }, [username]);

    if (loading) {
        return (
            <div className="text-white">
                Loading Profile...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-400">
                {error}
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-slate-400">
                User not found
            </div>
        );
    }

    return (
        <div className="space-y-8">

            <ProfileHeader
                user={user}
                stats={stats}
                isOwner={false}
            />

            <ProfileTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {
                activeTab === "overview" && (

                    <div
                        className="
                        grid
                        lg:grid-cols-3
                        gap-6
                        "
                    >

                        <div className="space-y-6">

                            <SkillsCard
                                user={user}
                            />

                            <EducationCard
                                user={user}
                            />

                        </div>

                        <div className="lg:col-span-2">

                            <ProfileProjects
                                username={
                                    user.username
                                }
                                onStatsLoaded={
                                    setStats
                                }
                                setActiveTab={
                                    setActiveTab
                                }
                            />

                        </div>

                    </div>

                )
            }

            {
                activeTab === "projects" && (

                    <ProfileProjects
                        username={
                            user.username
                        }
                        showAll={true}
                        onStatsLoaded={
                            setStats
                        }
                    />

                )
            }

        </div>
    );
}

export default UserProfile;