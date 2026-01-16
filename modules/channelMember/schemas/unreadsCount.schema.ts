import fastJson from 'fast-json-stringify';

const schema: fastJson.ObjectSchema = {
    title: 'Unreads Count',
    type: 'object',
    properties: {
        data: {
            type: 'object',
            patternProperties: {
                '.*.': {
                    type: 'array',
                    items: {
                        type: 'number',
                    },
                },
            },
        },
        message: {type: 'string'},
    },
};

export default schema;
