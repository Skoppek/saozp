import { eq } from 'drizzle-orm';
import { NewProfile, profileSchema } from '../model/schemas/profileSchema';
import { db } from '../model/db/db';

export default class ProfileRepository {
    async createProfile(newProfile: NewProfile) {
        await db.insert(profileSchema).values(newProfile);
    }

    async getProfileByUserId(userId: number) {
        const result = await db
            .select()
            .from(profileSchema)
            .where(eq(profileSchema.userId, userId));

        return result.at(0);
    }
}
