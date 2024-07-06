import { eq } from 'drizzle-orm';
import { NewUser, User, userSchema } from '../model/schemas/userSchema';
import { db } from '../model/db/db';

const getUserByLogin = async (login: string): Promise<User | undefined> => {
    return (
        await db.select().from(userSchema).where(eq(userSchema.login, login))
    ).at(0);
};

const getUserById = async (id: number): Promise<User | undefined> => {
    return (await db.select().from(userSchema).where(eq(userSchema.id, id))).at(
        0,
    );
};

const createUser = async (user: NewUser): Promise<User | undefined> => {
    return (await db.insert(userSchema).values(user).returning()).at(0);
};

export default {
    getUserByLogin,
    getUserById,
    createUser,
};
