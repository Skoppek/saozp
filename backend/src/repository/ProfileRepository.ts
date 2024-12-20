import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { usersToGroupSchema } from '../db/schema/usersToGroupSchema';
import { usersToContestSchema } from '../db/schema/usersToContestSchema';
import { NewProfile, profileSchema } from '../db/schema/profileSchema';

export default abstract class ProfileRepository {
    static async createProfile(newProfile: NewProfile) {
        await db.insert(profileSchema).values(newProfile);
    }

    static async getAllProfiles() {
        return db.select().from(profileSchema);
    }

    static async getProfileByUserId(userId: number) {
        const result = await db
            .select()
            .from(profileSchema)
            .where(eq(profileSchema.userId, userId));

        return result.at(0);
    }

    static async getProfilesOfGroup(groupId: number) {
        const result = await db
            .select({
                profile: profileSchema,
            })
            .from(profileSchema)
            .innerJoin(
                usersToGroupSchema,
                eq(usersToGroupSchema.userId, profileSchema.userId),
            )
            .where(eq(usersToGroupSchema.groupId, groupId));

        return result.map((entry) => entry.profile);
    }

    static async getProfilesOfContest(contestId: number) {
        const result = await db
            .select({ profile: profileSchema })
            .from(profileSchema)
            .innerJoin(
                usersToContestSchema,
                eq(usersToContestSchema.userId, profileSchema.userId),
            )
            .where(eq(usersToContestSchema.contestId, contestId));

        return result.map((entry) => entry.profile);
    }
}
