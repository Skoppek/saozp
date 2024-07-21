import { CreateGroupBody, UpdateGroupBody } from '../bodies/groupRequests';
import { GroupCreationError, GroupNotFoundError } from '../errors/groupErrors';
import GroupRepository from '../repository/GroupRepository';

export class GroupService {
    private groupRepository = new GroupRepository();

    async createGroup({ name }: CreateGroupBody, ownerId: number) {
        const newGroup = await this.groupRepository.createGroup({
            name,
            owner: ownerId,
        });

        if (!newGroup) {
            throw new GroupCreationError();
        }
    }

    async getGroupList() {
        return await this.groupRepository.getGroupList();
    }

    async getGroup(groupId: number) {
        const group = await this.groupRepository.getGroup(groupId);

        if (!group) {
            throw new GroupNotFoundError(groupId);
        }

        const users = await this.groupRepository.getProfilesOfGroup(groupId);

        return {
            ...group,
            users,
        };
    }

    async updateGroup(data: UpdateGroupBody, groupId: number) {
        const updatedGroup = await this.groupRepository.updateGroup(
            data,
            groupId,
        );

        if (!updatedGroup) {
            throw new GroupNotFoundError(groupId);
        }
    }

    async deleteGroup(groupId: number) {
        await this.groupRepository.deleteGroup(groupId);
    }

    async addUsersToGroup(groupId: number, userIds: number[]) {
        if (!(await this.groupRepository.getGroup(groupId))) {
            throw new GroupNotFoundError(groupId);
        }

        await Promise.all(
            userIds.map((id) =>
                this.groupRepository.addUserToGroup(groupId, id),
            ),
        );
    }

    async removeUsersFromGroup(groupId: number, userIds: number[]) {
        if (!(await this.groupRepository.getGroup(groupId))) {
            throw new GroupNotFoundError(groupId);
        }

        await Promise.all(
            userIds.map((id) =>
                this.groupRepository.removeUserFromGroup(groupId, id),
            ),
        );
    }
}
