import { CreateUserGroupRequestBody } from '../requests/userGroupRequests';
import userGroupRepository from '../repository/userGroupRepository';
import { UserGroupCreationError } from '../errors/userGroupErrors';

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
}
