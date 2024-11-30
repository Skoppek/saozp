import { Elysia } from 'elysia';
import { cron } from '@elysiajs/cron';
import PasswordResetTokenRepository from '../repository/PasswordResetTokenRepository';

export const passwordResetTokenCleaner = new Elysia().use(
    cron({
        name: 'delete-expired-password-reset-tokens',
        pattern: '* * */1 * * *',
        run() {
            PasswordResetTokenRepository.removeExpiredTokens();
        },
    }),
);
