import { Elysia } from 'elysia';
import { cron } from '@elysiajs/cron';
import sessionRepository from '../repository/sessionRepository';

export const sessionCleaner = new Elysia().use(
    cron({
        name: 'delete-expired-sessions',
        pattern: '* * */1 * * *',
        run() {
            sessionRepository.deleteExpiredSessions();
        },
    }),
);
