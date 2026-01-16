import {ObjectId} from 'mongodb';

import type {Gender, ImageObject, _ID} from '../utils';
import type Channel from './channel';
import type Team from './team';

export type User = {
    _id: ObjectId;
    googleId: string;
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    gender: Gender;
    image: ImageObject;
    teamIds: ObjectId[];
    channelIds: ObjectId[];
    roleIds: ObjectId[];
    preferences: {
        selectedTeamId: 'dm' | _ID<Team>;
        selectedChannelId: _ID<Channel>;
    };
    isOnline: boolean;
    createdAt: number;
    updatedAt: number;
};
