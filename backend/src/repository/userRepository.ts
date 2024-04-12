import { eq } from 'drizzle-orm';
import { NewUser, User, users } from '../model/schemas/userSchema';
import { db } from '../model/db/db';

const getUserByEmail = async (email: string): Promise<User[]> => {
    return await db.select().from(users).where(eq(users.email, email));
};

const getUserById = async (id: number): Promise<User[]> => {
    return await db.select().from(users).where(eq(users.id, id));
};

const createUser = async (user: NewUser): Promise<NewUser[]> => {
    return await db.insert(users).values(user).returning();
};

export default {
    getUserByEmail,
    getUserById,
    createUser,
};
