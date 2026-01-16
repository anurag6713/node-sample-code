import type {_ID} from '../utils';
import type {Channel} from './channel';
import type {User} from './user';
import type {ObjectId} from 'mongodb';

export type Message = {
    _id: ObjectId;
    tempId: ObjectId;
    channelId: _ID<Channel>;
    userId: _ID<User>;
    type: 'c' | 't' | 'j' | 'l'; // c: created, t: text, j: joined, l: left
    props: {
        addedUserIds: _ID<User>[];
        addedBy: _ID<User>;
        removedUserIds: _ID<User>[];
        removedBy: _ID<User>;
    };
    text: string;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
};

export type MessagesBucket = {
    _id: ObjectId;
    channelId: ObjectId;
    rootId?: _ID<Message>; // Applicable when it becomes a thread
    messages: Message[];
    count: number;
    firstMessageId: ObjectId;
    lastMessageId: ObjectId;
    lastMessageAt: number;
    type: 'm' | 't'; // Message or Thread
    createdAt: number;
    updatedAt: number;
};
