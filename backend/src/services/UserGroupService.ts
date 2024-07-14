import {
    CreateUserGroupRequestBody,
    UpdateUserGroupRequestBody,
} from '../requests/userGroupRequests';
import userGroupRepository from '../repository/userGroupRepository';
import {
    UserGroupCreationError,
    UserGroupNotFoundError,
} from '../errors/userGroupErrors';

export class UserGroupService {
    async createUserGroup(
        { name }: CreateUserGroupRequestBody,
        ownerId: number,
    ) {
        const newGroup = await userGroupRepository.createUserGroup({
            name,
            owner: ownerId,
        });

        if (!newGroup) {
            throw new UserGroupCreationError();
        }
    }

    async getUserGroupList() {
        return await userGroupRepository.getUserGroupList();
    }

    async getUserGroup(groupId: number) {
        const group = await userGroupRepository.getUserGroup(groupId);

        if (!group) {
            throw new UserGroupNotFoundError(groupId);
        }

        const users = await userGroupRepository.getProfilesOfGroup(groupId);

        return {
            ...group,
            users,
        };
    }

    async updateUserGroup(data: UpdateUserGroupRequestBody, groupId: number) {
        const updatedGroup = await userGroupRepository.updateUserGroup(
            data,
            groupId,
        );

        if (!updatedGroup) {
            throw new UserGroupNotFoundError(groupId);
        }
    }

    async deleteUserGroup(groupId: number) {
        await userGroupRepository.deleteUserGroup(groupId);
    }

    async addUsersToGroup(groupId: number, userIds: number[]) {
        if (!(await userGroupRepository.getUserGroup(groupId))) {
            throw new UserGroupNotFoundError(groupId);
        }

        await Promise.all(
            userIds.map((id) =>
                userGroupRepository.addUserToGroup(groupId, id),
            ),
        );
    }

    async removeUsersFromGroup(groupId: number, userIds: number[]) {
        if (!(await userGroupRepository.getUserGroup(groupId))) {
            throw new UserGroupNotFoundError(groupId);
        }

        await Promise.all(
            userIds.map((id) =>
                userGroupRepository.removeUserFromGroup(groupId, id),
            ),
        );
    }
}
