import { Elysia } from 'elysia';
import { cron } from '@elysiajs/cron';
import SessionRepository from '../repository/SessionRepository';
import moment from 'moment';

export const sessionCleaner = new Elysia().use(
    cron({
        name: 'delete-expired-sessions',
        pattern: '*/5 * * * *',
        run() {
            SessionRepository.deleteExpiredSessions().then((res) => {
                if (!!res.length)
                    console.log(
                        `Cleaned ${res.length} sessions at ${moment().toLocaleString()}`,
                    );
            });
        },
    }),
);
