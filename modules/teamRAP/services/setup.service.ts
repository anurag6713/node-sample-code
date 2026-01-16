import {ObjectId} from 'mongodb';

import {TeamRAPCollection} from '@collections';
import {permissions, allPermissions} from '@constants/permissions';

import type {_ID, Team, TeamRAP, User} from '@customTypes';

type Deps = {
    teamId: _ID<Team>;
    type: Team['type'];
    userId: _ID<User>;
};

async function setup({teamId, type, userId}: Deps): Promise<TeamRAP[]> {
    // Moderator
    const moderatorPermissions = [];
    const teacherPermissions = [];
    const studentPermissions = [];
    const generalPermissions = [];

    const isOrg = type === 'org';

    for (let i = 0; i < allPermissions.length; i++) {
        const permission = allPermissions[i];
        switch (permission) {
            case permissions.TEAM.MANAGE:
            case permissions.TEAM.MANAGE_MEMBERS:
            case permissions.CHANNEL.VIEW_ALL:
                break;
            case permissions.CHANNEL.INVITE:
            case permissions.CHANNEL.MANAGE:
            case permissions.CHANNEL.MANAGE_MESSAGES:
            case permissions.CHANNEL.MANAGE_MEMBERS:
            case permissions.TEAM.MANAGE_ROLES:
                moderatorPermissions.push(permission);
                isOrg && teacherPermissions.push(permission);
                break;
            case permissions.TEAM.INVITE:
                moderatorPermissions.push(permission);
                break;
            default:
                moderatorPermissions.push(permission);
                if (isOrg) {
                    teacherPermissions.push(permission);
                    studentPermissions.push(permission);
                }
                generalPermissions.push(permission);
        }
    }

    const roles: TeamRAP[] = [
        {
            name: 'Owner',
            isOwner: true,
        },
        {
            name: 'Admin',
            permissions: allPermissions,
        },
        {
            name: 'Moderator',
            permissions: moderatorPermissions,
        },
    ] as TeamRAP[];

    if (isOrg) {
        roles.push(
            {
                name: 'Teacher',
                isTeacher: true,
                permissions: teacherPermissions,
            } as TeamRAP,
            {
                name: 'Student',
                isStudent: true,
                permissions: studentPermissions,
            } as TeamRAP,
        );
    }

    roles.push({
        isDefault: true,
        name: 'Member',
        permissions: generalPermissions,
    } as TeamRAP);

    const teamIdObject = new ObjectId(teamId);
    const createdBy = new ObjectId(userId);
    const createdAt = Date.now();

    for (let i = 0; i < roles.length; i++) {
        roles[i]._id = new ObjectId();
        roles[i].isPrimary = true;
        roles[i].order = i + 1;

        roles[i].teamId = teamIdObject;
        roles[i].createdAt = createdAt;
        roles[i].createdBy = createdBy;
        roles[i].updatedAt = createdAt;
        roles[i].status = 'a';
    }

    const operations = roles.map((role) => {
        return {
            insertOne: {
                document: role,
            },
        };
    });

    await TeamRAPCollection().bulkWrite(operations);

    return roles;
}

export default setup;
