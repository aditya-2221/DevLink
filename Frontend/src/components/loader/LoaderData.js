import {
    FolderGit2,
    Users,
    MessageCircle,
    Bell,
    Database
} from "lucide-react";

export const loaderMessages = [

    "Initializing DevLink...",

    "Building your developer workspace...",

    "Loading projects...",

    "Connecting team network...",

    "Synchronizing conversations...",

    "Fetching notifications...",

    "Preparing resources...",

    "Optimizing your experience...",

    "Almost ready..."

];

export const loaderSteps = [

    {
        icon: FolderGit2,
        label: "PROJECTS"
    },

    {
        icon: Users,
        label: "TEAMS"
    },

    {
        icon: MessageCircle,
        label: "CHAT"
    },

    {
        icon: Bell,
        label: "NOTIFICATIONS"
    },

    {
        icon: Database,
        label: "RESOURCES"
    }

];

export const ORBIT_DURATION = 18;

export const PARTICLE_COUNT = 25;

export const MESSAGE_DURATION = 2000;