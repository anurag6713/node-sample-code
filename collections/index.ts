import {Collection} from 'mongodb';

import {collectionNames} from '@constants';
import db from '@db';

import type {
    Channel,
    ChannelMember,
    ChannelRAP,
    MessagesBucket,
    Team,
    TeamInvite,
    TeamRAP,
    TeamMember,
    TeamMemberRAP,
    User,
    UserToken,
} from '@customTypes';

export function ChannelCollection(): Collection<Channel> {
    return db.get().collection(collectionNames.CHANNEL);
}

export function ChannelMemberCollection(): Collection<ChannelMember> {
    return db.get().collection(collectionNames.CHANNEL_MEMBER);
}

export function ChannelRAPCollection(): Collection<ChannelRAP> {
    return db.get().collection(collectionNames.CHANNEL_RAP);
}

export function MessagesBucketCollection(): Collection<MessagesBucket> {
    return db.get().collection(collectionNames.MESSAGES_BUCKET);
}

export function TeamCollection(): Collection<Team> {
    return db.get().collection<Team>(collectionNames.TEAM);
}

export function TeamInviteCollection(): Collection<TeamInvite> {
    return db.get().collection<TeamInvite>(collectionNames.TEAM_INVITE);
}

export function TeamRAPCollection(): Collection<TeamRAP> {
    return db.get().collection<TeamRAP>(collectionNames.TEAM_RAP);
}

export function TeamMemberCollection(): Collection<TeamMember> {
    return db.get().collection<TeamMember>(collectionNames.TEAM_MEMBER);
}

export function TeamMemberRAPCollection(): Collection<TeamMemberRAP> {
    return db.get().collection<TeamMemberRAP>(collectionNames.TEAM_MEMBER_RAP);
}

export function UserCollection(): Collection<User> {
    return db.get().collection<User>(collectionNames.USER);
}

export function UserTokenCollection(): Collection<UserToken> {
    return db.get().collection<UserToken>(collectionNames.USER_TOKEN);
}
