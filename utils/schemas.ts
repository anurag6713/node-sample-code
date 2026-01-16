import fastJson from 'fast-json-stringify';

export const defaultSchema = fastJson({
    title: 'Default Response Schema',
    type: 'object',
    properties: {
        message: {type: 'string'},
    },
});

export const createdSchema = fastJson({
    title: 'Default Created Response Schema',
    type: 'object',
    properties: {
        data: {
            type: 'object',
            properties: {
                _id: {type: 'string'},
            },
        },
        message: {type: 'string'},
    },
});

export const fileBasicObject: fastJson.Schema = {
    type: 'object',
    properties: {
        _id: {type: 'string'},
        url: {type: 'string'},
        mimeType: {type: 'string'},
        preview: {type: 'string'},
    },
};

export const imageBasicObject: fastJson.Schema = {
    type: 'object',
    properties: {
        url: {type: 'string'},
        mimeType: {type: 'string'},
        height: {type: 'number'},
        width: {type: 'number'},
        blurred: {type: 'string'},
    },
};

export const messageBasicObject: fastJson.Schema = {
    type: 'object',
    properties: {
        _id: {type: 'string'},
        tempId: {type: 'string'},
        channelId: {type: 'string'},
        userId: {type: 'string'},
        type: {type: 'string'},
        props: {
            type: 'object',
            properties: {
                addedUserIds: {type: 'array', items: {type: 'string'}},
                addedBy: {type: 'string'},
                removedUserIds: {type: 'array', items: {type: 'string'}},
                removedBy: {type: 'string'},
            },
        },
        text: {type: 'string'},
        createdAt: {type: 'number'},
        updatedAt: {type: 'number'},
        deletedAt: {type: 'number'},
        status: {type: 'string'},
    },
};

export const userBasicObject: fastJson.Schema = {
    type: 'object',
    properties: {
        googleId: {type: 'string'},
        _id: {type: 'string'},
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        email: {type: 'string'},
        dob: {type: 'string'},
        gender: {type: 'string'},
        image: {
            type: 'object',
            properties: {
                _id: {type: 'string'},
                default: imageBasicObject,
                thumbnail: imageBasicObject,
                blurred: {type: 'string'},
            },
        },
        preferences: {
            type: 'object',
            properties: {
                selectedTeamId: {type: 'string'},
                selectedChannelId: {type: 'string'},
            },
        },
        roleIds: {
            type: 'array',
            items: {type: 'string'},
        },
    },
};

export const channelMemberBasicObject: fastJson.Schema = {
    type: 'object',
    properties: {
        _id: {type: 'string'},
        channelId: {type: 'string'},
        userId: {type: 'string'},
        lastViewedAt: {type: 'number'},
        unreads: {type: 'number'}, // Dynamic field

        createdAt: {type: 'number'},
        updatedAt: {type: 'number'},
        status: {type: 'string'},
    },
};

export const channelRAPBasicObject: fastJson.Schema = {
    type: 'object',
    properties: {
        _id: {type: 'string'},
        channelId: {type: 'string'},
        roleId: {type: 'string'},
        permissions: {type: 'array', items: {type: 'string'}},
        excludedPermissions: {type: 'array', items: {type: 'string'}},
        createdAt: {type: 'number'},
        updatedAt: {type: 'number'},
        status: {type: 'string'},
    },
};

export const channelBasicObject: fastJson.Schema = {
    type: 'object',
    properties: {
        _id: {type: 'string'},
        name: {type: 'string'},
        type: {type: 'string'},
        purpose: {type: 'string'},
        header: {type: 'string'},
        isDefault: {type: 'boolean'},
        isPrivate: {type: 'boolean'},
        teamId: {type: 'string'},
        membersCount: {type: 'number'},
        lastMessageAt: {type: 'number'},

        createdAt: {type: 'number'},
        updatedAt: {type: 'number'},
        status: {type: 'string'},

        //
        // Relational properties
        //
        membership: channelMemberBasicObject,
        rap: channelRAPBasicObject,
    },
};

export const teamMemberRAPBasicObject: fastJson.Schema = {
    type: 'object',
    properties: {
        _id: {type: 'string'},
        userId: {type: 'string'},
        teamId: {type: 'string'},
        roleId: {type: 'string'},

        createdAt: {type: 'number'},
        updatedAt: {type: 'number'},
        status: {type: 'string'},
    },
};

export const teamRAPBasicObject: fastJson.Schema = {
    type: 'object',
    properties: {
        _id: {type: 'string'},
        isDefault: {type: 'boolean'},
        isOwner: {type: 'boolean'},
        isPrimary: {type: 'boolean'},
        isStudent: {type: 'boolean'},
        isTeacher: {type: 'boolean'},
        name: {type: 'string'},
        order: {type: 'number'},
        permissions: {type: 'array', items: {type: 'string'}},
        teamId: {type: 'string'},

        createdBy: {type: 'string'},
        createdAt: {type: 'number'},
        updatedAt: {type: 'number'},
        status: {type: 'string'},

        //
        // Relational properties
        //
        membership: teamMemberRAPBasicObject,
    },
};

export const teamMemberBasicObject: fastJson.Schema = {
    type: 'object',
    properties: {
        _id: {type: 'string'},
        teamId: {type: 'string'},
        userId: {type: 'string'},
        createdAt: {type: 'number'},
        updatedAt: {type: 'number'},
        status: {type: 'string'},
    },
};

export const teamBasicObject: fastJson.Schema = {
    type: 'object',
    properties: {
        _id: {type: 'string'},
        name: {type: 'string'},
        type: {type: 'string'},
        membersCount: {type: 'number'},
        createdAt: {type: 'number'},
        updatedAt: {type: 'number'},
        status: {type: 'string'},

        //
        // Relational properties
        //
        channels: {type: 'array', items: channelBasicObject},
        membership: teamMemberBasicObject,
        roles: {type: 'array', items: teamRAPBasicObject},
    },
};

export const teamInviteBasicObject: fastJson.Schema = {
    type: 'object',
    properties: {
        _id: {type: 'string'},
        isRead: {type: 'boolean'},
        team: teamBasicObject,
        teamId: {type: 'string'},
        userId: {type: 'string'},

        status: {type: 'string'},
        createdAt: {type: 'number'},
        createdBy: {type: 'string'},
        updatedAt: {type: 'number'},
    },
};

// WebSocketify the schema
export function wsfy(schema: fastJson.ObjectSchema): fastJson.ObjectSchema {
    return {
        title: 'Websocket schema',
        type: 'object',
        properties: {
            type: {type: 'string'},
            data: schema,
            user: userBasicObject,
        },
    };
}
