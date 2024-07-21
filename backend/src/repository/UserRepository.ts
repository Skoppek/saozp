import { eq } from 'drizzle-orm';
import { NewUser, User, userSchema } from '../model/schemas/userSchema';
import { db } from '../model/db/db';

export default class UserRepository {
    async createUser(user: NewUser) {
        const result = await db.insert(userSchema).values(user).returning();

        return result.at(0);
    }

    async getUserByLogin(login: string) {
        const result = await db
            .select()
            .from(userSchema)
            .where(eq(userSchema.login, login));

        return result.at(0);
    }

    async getUserById(id: number) {
        const result = await db
            .select()
            .from(userSchema)
            .where(eq(userSchema.id, id));

        return result.at(0);
    }

    async updateUser(id: number, user: Partial<User>) {
        const result = await db
            .update(userSchema)
            .set(user)
            .where(eq(userSchema.id, id))
            .returning();

        return result.at(0);
    }
}
