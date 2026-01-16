function hasAllPermissions(
    userPermissions: Set<string>,
    requiredPermissions: Set<string>,
): boolean {
    if (userPermissions.has('*')) {
        return true;
    }
    for (const permission of requiredPermissions) {
        if (!userPermissions.has(permission)) {
            return false;
        }
    }
    return true;
}

export default {
    hasAllPermissions,
};
