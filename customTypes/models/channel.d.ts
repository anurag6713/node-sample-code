import type {Team, TeamRAP} from './team';
import type {User} from './user';
import type {_ID} from '@customTypes/utils';
import type {ObjectId} from 'mongodb';

export type Channel = {
    _id: ObjectId;
    name: string;
    purpose: string;
    header: string;

    // Direct Message, Group Message or Channel
    type: 'dm' | 'gm' | 'c';
    isDefault: boolean;
    isPrivate: boolean;
    teamId: _ID<Team>;
    membersCount: number;

    lastMessageAt: number;
    createdBy: _ID<User>;
    createdAt: number;
    updatedAt: number;
    status: 'a' | 'ar' | 'd';

    //
    // RELATIONAL FIELDS
    //
    membership?: ChannelMember;
    rap?: ChannelRAP;
};

export type ChannelRAP = {
    _id: ObjectId;
    channelId: _ID<Channel>;
    roleId: _ID<TeamRAP>;
    permissions: string[];
    excludedPermissions: string[];

    createdAt: number;
    updatedAt: number;
    status: 'a' | 'd';
};

export type ChannelMember = {
    _id: ObjectId;
    channelId: _ID<Channel>;
    userId: _ID<User>;
    lastViewedAt: number;
    unreads?: number; // Dynamic field

    createdAt: number;
    updatedAt: number;
    status: 'a' | 'd';
};
