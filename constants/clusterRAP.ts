const permissions = {
    cluster: {
        add: 'ca',
        edit: 'ce',
        view: 'cv',
        archive: 'cac',
        remove: 'cr',
    },
    organisation: {
        add: 'oa',
        edit: 'oe',
        view: 'ov',
        manage: 'om',
        archive: 'oar',
        remove: 'or',
    },
    role: {
        view: 'rv',
        add: 'ra',
        edit: 're',
        remove: 'rr',
    },
};

const moderatorExcludedModules = ['role'];
const moderatorExcludedActions = ['archive', 'remove'];

const roles = {
    admin: [],
    moderator: [],
};
for (const module in permissions) {
    for (const action in permissions[module]) {
        roles.admin.push(permissions[module][action]);
        if (
            moderatorExcludedModules.indexOf(module) === -1 &&
            moderatorExcludedActions.indexOf(action) === -1
        ) {
            roles.moderator.push(permissions[module][action]);
        }
    }
}

export {roles, permissions};
