import { Session } from '../model/schemas/sessionSchema';
import SessionRepository from '../repository/SessionRepository';
import moment from 'moment';

export class SessionService {
    private static SESSION_LENGTH = Bun.env.SESSION_LENGTH_IN_HOURS ?? 2;

    static isSessionValid(session: Session) {
        return session.expiresAt > new Date();
    }

    static async createSession(userId: number) {
        const existingSession =
            await SessionRepository.getLatestSessionOfUser(userId);

        const expiryDate = moment()
            .add(SessionService.SESSION_LENGTH, 'hours')
            .toDate();

        const session =
            existingSession && SessionService.isSessionValid(existingSession)
                ? await SessionRepository.setSessionExpiryDate(
                      existingSession.id,
                      expiryDate,
                  )
                : await SessionRepository.createSession({
                      userId,
                      expiresAt: expiryDate,
                  });

        if (!session) {
            // throw 500
            throw new Error('Failed to create session');
        }

        return session;
    }
}
