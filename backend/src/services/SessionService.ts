import { Session } from '../model/schemas/sessionSchema';
import SessionRepository from '../repository/SessionRepository';

export class SessionService {
    private static SESSION_LENGTH = 1000 * 3600 * 2;
    private sessionRepository = new SessionRepository();

    static isSessionValid(session: Session) {
        return session.expiresAt > new Date();
    }

    async createSession(userId: number) {
        const existingSession =
            await this.sessionRepository.getLatestSessionOfUser(userId);

        const session =
            existingSession && SessionService.isSessionValid(existingSession)
                ? await this.sessionRepository.refreshSession(
                      existingSession.id,
                      SessionService.SESSION_LENGTH,
                  )
                : await this.sessionRepository.createSession({
                      userId,
                      expiresAt: new Date(
                          Date.now() + SessionService.SESSION_LENGTH,
                      ),
                  });

        if (!session) {
            // throw 500
            throw new Error('Failed to create session');
        }

        return session;
    }
}
