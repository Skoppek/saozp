import { ProfileNotFoundError } from '../errors/profileErrors';
import ProfileRepository from '../repository/ProfileRepository';

export abstract class ProfileService {
    static async createProfile(
        userId: number,
        firstName: string,
        lastName: string,
    ) {
        return await ProfileRepository.createProfile({
            userId,
            firstName,
            lastName,
        });
    }

    static async getProfileByUserId(userId: number) {
        const profile = await ProfileRepository.getProfileByUserId(userId);

        if (!profile) {
            throw new ProfileNotFoundError();
        }

        return profile;
    }

    static async getAllProfiles() {
        return await ProfileRepository.getAllProfiles();
    }
}
