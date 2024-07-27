import { eq } from 'drizzle-orm';
import { NewUser, User, userSchema } from '../model/schemas/userSchema';
import { db } from '../model/db/db';
import { usersToGroupSchema } from '../model/schemas/intermediates/usersToGroupSchema';
import { usersToContestSchema } from '../model/schemas/intermediates/usersToContestSchema';

export default abstract class UserRepository {
    static async createUser(user: NewUser) {
        const result = await db.insert(userSchema).values(user).returning();

        return result.at(0);
    }

    static async getUserByLogin(login: string) {
        const result = await db
            .select()
            .from(userSchema)
            .where(eq(userSchema.login, login));

        return result.at(0);
    }

    static async getUserById(id: number) {
        const result = await db
            .select()
            .from(userSchema)
            .where(eq(userSchema.id, id));

        return result.at(0);
    }

    static async getUsersOfGroup(groupId: number) {
        return db
            .select()
            .from(userSchema)
            .innerJoin(
                usersToGroupSchema,
                eq(usersToGroupSchema.userId, userSchema.id),
            )
            .where(eq(usersToGroupSchema.groupId, groupId));
    }

    static async getUsersOfContest(contestId: number) {
        return db
            .select()
            .from(userSchema)
            .innerJoin(
                usersToContestSchema,
                eq(usersToContestSchema.userId, userSchema.id),
            )
            .where(eq(usersToContestSchema.contestId, contestId));
    }

    static async updateUser(id: number, user: Partial<User>) {
        const result = await db
            .update(userSchema)
            .set(user)
            .where(eq(userSchema.id, id))
            .returning();

        return result.at(0);
    }
}
