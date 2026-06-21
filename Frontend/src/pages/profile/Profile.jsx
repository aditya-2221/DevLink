import ProfileHeader from "../../components/ui/ProfileHeader";
import ProfileTabs from "../../components/ui/ProfileTabs";

import EducationCard from "../../components/cards/EducationCard";
import SkillsCard from "../../components/cards/SkillsCard";
import ProfileProjects from "../../components/cards/ProfileProjects";
import { useState } from "react";
import {
    useSelector
} from "react-redux";

import EditProfileModal
    from "../../components/modals/EditProfileModal";

function Profile() {

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("profile");
    const [stats, setStats] = useState({
        projects: 0,
        likes: 0,
        bookmarks: 0,
    });

    const [activeTab, setActiveTab] = useState("overview");

    const { user } = useSelector(
        state => state.auth
    );

    return (
        <div className="space-y-8">

            <ProfileHeader
                stats={stats}

                onEdit={() => {
                    setModalType("profile");
                    setShowModal(true);
                }}

                onLinkProfiles={() => {
                    setModalType("socials");
                    setShowModal(true);
                }}
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
                            <SkillsCard />
                            <EducationCard />
                        </div>

                        <div className="lg:col-span-2">

                            <ProfileProjects
                                onStatsLoaded={setStats}
                                setActiveTab={setActiveTab}
                            />

                        </div>

                    </div>

                )
            }

            {
                activeTab === "projects" && (

                    <ProfileProjects
                        showAll={true}
                        onStatsLoaded={setStats}
                    />

                )
            }
            {
                showModal && (
                    <EditProfileModal
                        user={user}
                        type={modalType}
                        onClose={() =>
                            setShowModal(false)
                        }
                    />
                )
            }

        </div>
    );
}

export default Profile;