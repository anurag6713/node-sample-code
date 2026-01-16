import {Db, MongoClient} from 'mongodb';

import {
    ChannelCollection,
    ChannelMemberCollection,
    MessagesBucketCollection,
    TeamCollection,
    TeamInviteCollection,
    TeamRAPCollection,
    TeamMemberCollection,
    UserCollection,
    UserTokenCollection,
} from '@collections';
import config from '@config';

let client: MongoClient;
let db: Db;

async function connect(
    uri: string = config.MONGO_URI,
    dbName: string = config.MONGO_DB_NAME,
): Promise<Db> {
    const clientObj: MongoClient = await MongoClient.connect(uri);
    db = clientObj.db(dbName);
    client = clientObj;

    function updateRecord(
        collection: any,
        record: any,
        fields: string[],
    ): Promise<any> {
        const $set = {};
        fields.forEach((field: string) => {
            const d = new Date(record[field]).getTime();
            $set[field] = isNaN(d) ? 0 : d;
        });
        return collection().updateOne({_id: record._id}, {$set});
    }

    const channels = await ChannelCollection().find().toArray();
    for (let i = 0; i < channels.length; i++) {
        await updateRecord(ChannelCollection, channels[i], [
            'lastMessageAt',
            'createdAt',
            'updatedAt',
        ]);
    }
    console.log(channels.length);

    const ChannelMember = await ChannelMemberCollection().find().toArray();
    for (let i = 0; i < ChannelMember.length; i++) {
        await updateRecord(ChannelMemberCollection, ChannelMember[i], [
            'createdAt',
            'updatedAt',
            'lastViewedAt',
        ]);
    }

    const MessagesBucket = await MessagesBucketCollection().find().toArray();
    for (let i = 0; i < MessagesBucket.length; i++) {
        await MessagesBucketCollection().updateOne(
            {
                _id: MessagesBucket[i]._id,
            },
            {
                $set: {
                    messages: MessagesBucket[i].messages.map((message) => {
                        return {
                            ...message,
                            createdAt: new Date(message.createdAt).getTime(),
                            updatedAt: message.updatedAt
                                ? new Date(message.updatedAt).getTime()
                                : 0,
                        };
                    }),
                },
            },
        );
        await updateRecord(MessagesBucketCollection, MessagesBucket[i], [
            'createdAt',
            'updatedAt',
            'lastMessageAt',
        ]);
    }
    console.log(MessagesBucket.length);

    const Team = await TeamCollection().find().toArray();
    for (let i = 0; i < Team.length; i++) {
        await updateRecord(TeamCollection, Team[i], ['createdAt', 'updatedAt']);
    }
    console.log(Team.length);

    const TeamInvite = await TeamInviteCollection().find().toArray();
    for (let i = 0; i < TeamInvite.length; i++) {
        await updateRecord(TeamInviteCollection, TeamInvite[i], [
            'createdAt',
            'updatedAt',
        ]);
    }
    console.log(TeamInvite.length);

    const TeamRAP = await TeamRAPCollection().find().toArray();
    for (let i = 0; i < TeamRAP.length; i++) {
        await updateRecord(TeamRAPCollection, TeamRAP[i], [
            'createdAt',
            'updatedAt',
        ]);
    }
    console.log(TeamRAP.length);

    const TeamMember = await TeamMemberCollection().find().toArray();
    for (let i = 0; i < TeamMember.length; i++) {
        await updateRecord(TeamMemberCollection, TeamMember[i], [
            'createdAt',
            'updatedAt',
        ]);
    }
    console.log(TeamMember.length);

    const User = await UserCollection().find().toArray();
    for (let i = 0; i < User.length; i++) {
        await updateRecord(UserCollection, User[i], ['createdAt', 'updatedAt']);
    }
    console.log(User.length);

    const UserToken = await UserTokenCollection().find().toArray();
    for (let i = 0; i < UserToken.length; i++) {
        await updateRecord(UserTokenCollection, UserToken[i], [
            'createdAt',
            'lastConnectedAt',
            'lastDisconnectedAt',
        ]);
    }
    console.log(UserToken.length);

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
