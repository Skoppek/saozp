import {
    CreateUserGroupBody,
    UpdateUserGroupBody,
} from '../bodies/userGroupRequests';
import groupRepository from '../repository/groupRepository';
import { GroupCreationError, GroupNotFoundError } from '../errors/groupErrors';

export class GroupService {
    async createUserGroup({ name }: CreateUserGroupBody, ownerId: number) {
        const newGroup = await groupRepository.createGroup({
            name,
            owner: ownerId,
        });

        if (!newGroup) {
            throw new GroupCreationError();
        }
    }

    async getUserGroupList() {
        return await groupRepository.getGroupList();
    }

    async getUserGroup(groupId: number) {
        const group = await groupRepository.getGroup(groupId);

        if (!group) {
            throw new GroupNotFoundError(groupId);
        }

        const users = await groupRepository.getProfilesOfGroup(groupId);

        return {
            ...group,
            users,
        };
    }

    async updateUserGroup(data: UpdateUserGroupBody, groupId: number) {
        const updatedGroup = await groupRepository.updateGroup(data, groupId);

        if (!updatedGroup) {
            throw new GroupNotFoundError(groupId);
        }
    }

    async deleteUserGroup(groupId: number) {
        await groupRepository.deleteGroup(groupId);
    }

    async addUsersToGroup(groupId: number, userIds: number[]) {
        if (!(await groupRepository.getGroup(groupId))) {
            throw new GroupNotFoundError(groupId);
        }

        await Promise.all(
            userIds.map((id) => groupRepository.addUserToGroup(groupId, id)),
        );
    }

    async removeUsersFromGroup(groupId: number, userIds: number[]) {
        if (!(await groupRepository.getGroup(groupId))) {
            throw new GroupNotFoundError(groupId);
        }

        await Promise.all(
            userIds.map((id) =>
                groupRepository.removeUserFromGroup(groupId, id),
            ),
        );
    }
}
