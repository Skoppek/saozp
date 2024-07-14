import { ProfileNotFoundError } from '../errors/profileErrors';
import ProfileRepository from '../repository/ProfileRepository';

export class ProfileService {
    profileRepository = new ProfileRepository();

    async createProfile(userId: number, firstName: string, lastName: string) {
        return await this.profileRepository.createProfile({
            userId,
            firstName,
            lastName,
        });
    }

    async getProfileByUserId(userId: number) {
        const profile = await this.profileRepository.getProfileByUserId(userId);

        if (!profile) {
            throw new ProfileNotFoundError();
        }

        return profile;
    }
}
