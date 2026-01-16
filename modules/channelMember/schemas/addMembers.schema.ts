import fastJson from 'fast-json-stringify';

const schema: fastJson.ObjectSchema = {
    title: 'Add Members To The Channel',
    type: 'object',
    properties: {
        data: {
            type: 'object',
            properties: {
                failedUserIds: {
                    type: 'array',
                    items: {type: 'string'},
                },
            },
        },
        message: {type: 'string'},
    },
};

export default schema;
