import { eq } from 'drizzle-orm';
import { NewUser, User, userSchema } from '../model/schemas/userSchema';
import { db } from '../model/db/db';

const getUserByEmail = async (email: string): Promise<User[]> => {
    return await db
        .select()
        .from(userSchema)
        .where(eq(userSchema.email, email));
};

const getUserById = async (id: number): Promise<User[]> => {
    return await db.select().from(userSchema).where(eq(userSchema.id, id));
};

const createUser = async (user: NewUser): Promise<NewUser[]> => {
    return await db.insert(userSchema).values(user).returning();
};

export default {
    getUserByEmail,
    getUserById,
    createUser,
};
