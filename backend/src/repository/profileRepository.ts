import { eq } from 'drizzle-orm';
import { NewProfile, Profile, profiles } from '../model/schemas/profileSchema';
import { db } from '../model/db/db';

const createProfile = async (newProfile: NewProfile) => {
    await db.insert(profiles).values(newProfile);
};

const getProfileByUserId = async (userId: number): Promise<Profile[]> => {
    return await db.select().from(profiles).where(eq(profiles.userId, userId));
};

export default {
    createProfile,
    getProfileByUserId,
};
