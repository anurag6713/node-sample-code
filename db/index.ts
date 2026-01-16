import {Db, MongoClient} from 'mongodb';

import config from '@config';
import {collectionNames} from '@constants';

let client: MongoClient;
let db: Db;

async function connect(
    uri: string = config.MONGO_URI,
    dbName: string = config.MONGO_DB_NAME,
): Promise<Db> {
    const clientObj: MongoClient = await MongoClient.connect(uri);
    db = clientObj.db(dbName);

    // Create indexes
    db.collection(collectionNames.USER).createIndex(
        {
            firstName: 'text',
            lastName: 'text',
            email: 'text',
        },
        {
            background: true,
        },
    );

    db.collection(collectionNames.USER).createIndexes(
        [
            {
                key: {firstName: 1},
            },
            {
                key: {lastName: 1},
            },
            {
                key: {email: 1},
            },
        ],
        {
            unique: true,
        },
    );

    client = clientObj;
    return db;
}

function get(): Db {
    return db;
}

function getClient(): MongoClient {
    return client;
}

function disconnect(): void {
    client && client.close();
}

export default {
    connect,
    disconnect,
    get,
    getClient,
};
