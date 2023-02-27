import fastJson from 'fast-json-stringify';

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
