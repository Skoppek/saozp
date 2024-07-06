import profileRepository from '../repository/profileRepository';

export class ProfileService {
    async createProfile(userId: number, firstName: string, lastName: string) {
        return await profileRepository.createProfile({
            userId,
            firstName,
            lastName,
        });
    }
}
