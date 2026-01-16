import type {_ID} from '../utils';
import type {Team} from './team';
import type {User} from './user';
import type {ObjectId} from 'mongodb';

export type TeamRAP = {
    _id: ObjectId;

    isDefault: boolean;
    isOwner: boolean;
    isPrimary: boolean;
    isStudent: boolean;
    isTeacher: boolean;

    name: string;
    order: number;
    permissions: string[];
    teamId: _ID<Team>;

    createdBy: _ID<User>;
    createdAt: number;
    updatedAt: number;
    status: 'a' | 'd';

    //
    // RELATIONAL FIELDS
    //
    membership?: TeamMemberRAP;
};

export type TeamMemberRAP = {
    _id: ObjectId;
    teamId: _ID<Team>;
    userId: _ID<User>;
    roleId: _ID<TeamRAP>;

    createdAt: number;
    updatedAt: number;
    status: 'a' | 'd';
};
