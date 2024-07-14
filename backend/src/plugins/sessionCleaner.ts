import { Elysia } from 'elysia';
import { cron } from '@elysiajs/cron';
import SessionRepository from '../repository/SessionRepository';

export const sessionCleaner = new Elysia().use(
    cron({
        name: 'delete-expired-sessions',
        pattern: '* * */1 * * *',
        run() {
            SessionRepository.deleteExpiredSessions();
        },
    }),
);
