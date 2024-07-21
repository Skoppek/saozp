import { db } from '../model/db/db';
import {
    PasswordResetToken,
    passwordResetTokenSchema,
} from '../model/schemas/passwordResetTokenSchema';
import { eq } from 'drizzle-orm/sql';
import { lt } from 'drizzle-orm';

export default class {
    async putToken(passwordResetToken: PasswordResetToken) {
        await db
            .insert(passwordResetTokenSchema)
            .values(passwordResetToken)
            .onConflictDoUpdate({
                target: passwordResetTokenSchema.userId,
                set: {
                    token: passwordResetToken.token,
                    expiresAt: passwordResetToken.expiresAt,
                },
            })
            .returning();
    }

    async removeTokenOfUser(userId: number) {
        await db
            .delete(passwordResetTokenSchema)
            .where(eq(passwordResetTokenSchema.userId, userId));
    }

    static removeExpiredTokens() {
        db.delete(passwordResetTokenSchema).where(
            lt(passwordResetTokenSchema.expiresAt, new Date()),
        );
    }

    async getTokenForUser(userId: number) {
        const result = await db
            .select()
            .from(passwordResetTokenSchema)
            .where(eq(passwordResetTokenSchema.userId, userId));

        return result.at(0);
    }

    async getTokenByToken(token: string) {
        const result = await db
            .select()
            .from(passwordResetTokenSchema)
            .where(eq(passwordResetTokenSchema.token, token));

        return result.at(0);
    }
}
