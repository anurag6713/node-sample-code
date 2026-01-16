const WSE = {
    // CHANNEL
    CHANNEL_JOINED: 'channel_joined',
    CHANNEL_LEFT: 'channel_left',
    CHANNELS_LIST: 'channels_list',
    CHANNELS_MEMBERSHIPS: 'channels_memberships',
    CHANNEL_RAP_UPDATED: 'channel_rap_updated',
    CHANNELS_RAP_LIST: 'channels_rap_list',
    CHANNEL_UNREADS: 'channel_unreads',
    CHANNNELS_UNREADS: 'channels_unreads',
    CHANNEL_VIEWED: 'channel_viewed',

    // MESSAGE
    MESSAGES_LIST: 'messages_list',
    MESSAGE_RECEIVED: 'message_received',
    MESSAGE_TYPING: 'message_typing',
    MESSAGE_DELETED: 'message_deleted',
    MESSAGE_EDITED: 'message_edited',

    // TEAM
    TEAM_JOINED: 'team_joined',
    TEAM_LEFT: 'team_left',
    TEAM_INVITE_DECLINED: 'team_invite_declined',
    TEAM_INVITE_RECEIVED: 'team_invite_received',
    TEAM_INVITES_RECEIVED: 'team_invites_received',
    TEAM_INVITES_READ: 'team_invites_read',
    TEAMS_LIST: 'teams_list',
    TEAMS_MEMBERSHIPS: 'teams_memberships',

    // TEAM RAP
    TEAM_RAP_LIST: 'team_rap_list',
    TEAM_RAP_UPDATED: 'team_rap_updated',
    TEAM_RAP_DELETED: 'team_rap_deleted',
    TEAM_MEMBER_RAP_LIST: 'team_member_rap_list',

    // USER
    MY_DATA: 'my_data',
    UNAUTHORIZED: 'unauthorized',
} as const;

export default WSE;
