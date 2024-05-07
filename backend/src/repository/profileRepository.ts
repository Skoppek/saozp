import { eq } from 'drizzle-orm';
import {
    NewProfile,
    Profile,
    profileSchema,
} from '../model/schemas/profileSchema';
import { db } from '../model/db/db';

const createProfile = async (newProfile: NewProfile) => {
    await db.insert(profileSchema).values(newProfile);
};

const getProfileByUserId = async (
    userId: number,
): Promise<Profile | undefined> => {
    return (
        await db
            .select()
            .from(profileSchema)
            .where(eq(profileSchema.userId, userId))
    ).at(0);
};

export default {
    createProfile,
    getProfileByUserId,
};
