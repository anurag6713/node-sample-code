const APP_SCHEME = process.env.APP_SCHEME || 'com.uclidApp.uclidApp://';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL || 'http://localhost:19006';
const MASTER_APP_SCHEME =
    process.env.MASTER_APP_SCHEME || 'com.uclidApp.uclidApp://';
const MASTER_CLIENT_BASE_URL =
    process.env.MASTER_CLIENT_BASE_URL || 'http://localhost:19006';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'uclid-dev';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const SECRET_KEY = '@1345()*';

export default {
    APP_SCHEME,
    API_BASE_URL,
    CLIENT_BASE_URL,
    GOOGLE: {
        CLIENT_ID:
            process.env.GOOGLE_CLIENT_ID ||
            '954745235574-76k9epln2jjqqs70uitlp5ebvamgobuo.apps.googleusercontent.com',
        CLIENT_SECRET:
            process.env.GOOGLE_CLIENT_SECRET || '_YAVQBm6JrQjA-RgoS6OhZV6',
        REDIRECT_URI: API_BASE_URL + '/user/login-success',
    },
    MASTER_APP_SCHEME,
    MASTER_CLIENT_BASE_URL,
    MESSAGE_MAX_LENGTH: 1024,
    MESSAGES_PER_BUCKET: 5000,
    MINIMUM_AGE: 16,
    MONGO_DB_NAME,
    MONGO_URI,
    NODE_ENV,
    PORT,
    SECRET_KEY,
};
