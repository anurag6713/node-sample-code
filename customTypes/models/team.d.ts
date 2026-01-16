import type {Channel} from './channel';
import type {User} from './user';
import type {_ID} from '@customTypes/utils';
import type {ObjectId} from 'mongodb';

export type Team = {
    _id: ObjectId;
    name: string;

    // Organization, Study Group or Other
    type: 'org' | 'sg' | 'o';

    membersCount: number;

    createdAt: number;
    createdBy: _ID<User>;
    updatedAt: number;
    status: 'a' | 'ar' | 'd';

    //
    // RELATIONAL FIELDS
    //
    channels?: Channel[];
    membership?: TeamMember;
    roles?: TeamRAP[];
};

export type TeamInvite = {
    _id: ObjectId;
    userId: _ID<User>;
    email: string;
    teamId: _ID<Team>;
    isRead: boolean;

    createdBy: _ID<User>;
    createdAt: number;
    updatedAt: number;
    status: 'a' | 'd';

    //
    // RELATIONAL FIELDS
    //
    team?: Team;
};

export type TeamMember = {
    _id: string;
    teamId: _ID<Team>;
    userId: _ID<User>;

    createdAt: number;
    updatedAt: number;
    status: 'a' | 'd';
};
