import profileRepository from '../repository/profileRepository';
import { ProfileNotFoundError } from '../errors/profileErrors';

export class ProfileService {
    async createProfile(userId: number, firstName: string, lastName: string) {
        return await profileRepository.createProfile({
            userId,
            firstName,
            lastName,
        });
    }

    async getProfileByUserId(userId: number) {
        const profile = await profileRepository.getProfileByUserId(userId);

        if (!profile) {
            throw new ProfileNotFoundError();
        }

        return profile;
    }
}
