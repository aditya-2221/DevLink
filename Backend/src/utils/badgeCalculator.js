export const calculateBadges = (
    user,
    stats
) => {

    const badges = [];

    if (
        user.profileCompletion === 100
    ) {
        badges.push(
            "verified-profile"
        );
    }

    if (
        stats.projects >= 5 &&
        stats.likes >= 25
    ) {
        badges.push(
            "devlink-developer"
        );
    }

    if (
        stats.projects >= 15 &&
        stats.likes >= 100 &&
        stats.bookmarks >= 50
    ) {
        badges.push(
            "top-contributor"
        );
    }

    if (
        stats.projects >= 30 &&
        stats.likes >= 300 &&
        stats.bookmarks >= 150
    ) {
        badges.push(
            "elite-developer"
        );
    }

    return badges;
};