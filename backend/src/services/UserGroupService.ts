import { CreateUserGroupRequestBody } from '../requests/userGroupRequests';
import userGroupRepository from '../repository/userGroupRepository';

export class UserGroupService {
    async createUserGroup(
        { name }: CreateUserGroupRequestBody,
        ownerId: number,
    ) {
        await userGroupRepository.createUserGroup({
            name,
            owner: ownerId,
        });
    }
}
