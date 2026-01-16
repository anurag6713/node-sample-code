import addMember from './addMember.service';
import getChannels from './getChannels.service';
import getMemberships from './getMemberships.service';
import getUnjoinedPublicChannels from './getUnjoinedPubicChannels.service';
import getUnreadsCount from './getUnreadsCount.service';
import isMember from './isMember.service';
import removeMember from './removeMember.service';
import updateLastViewedAt from './updateLastViewedAt.service';
import updateMembersCount from './updateMembersCount.service';

export default {
    addMember,
    getChannels,
    getMemberships,
    getUnjoinedPublicChannels,
    getUnreadsCount,
    isMember,
    removeMember,
    updateLastViewedAt,
    updateMembersCount,
};
