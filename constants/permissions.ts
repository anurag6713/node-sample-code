const permissions = {
    TEAM: {
        INVITE: 'ti',
        MANAGE: 'tm',
        MANAGE_ROLES: 'tmr',
        MANAGE_MEMBERS: 'tmme',
    },
    CHANNEL: {
        // Browse channels
        VIEW: 'cv', // Excluding private
        VIEW_ALL: 'cva', // Including private
        MANAGE: 'cm', // Create, Edit, Archive or Delete channels
        MANAGE_MESSAGES: 'cmm', // Delete or Edit other's messages or Pin messages
        INVITE: 'ci',
        MANAGE_MEMBERS: 'cmme',
    },
    MESSAGE: {
        ATTACH_FILES: 'maf',
        SEND: 'ms',
        SEND_THREAD: 'mst',
        REACT: 'mr',
    },
};

const allPermissions = [];
for (const key in permissions) {
    for (const key2 in permissions[key]) {
        allPermissions.push(permissions[key][key2]);
    }
}

export {allPermissions, permissions};
