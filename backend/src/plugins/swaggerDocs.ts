import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';

export const swaggerDocs = new Elysia().use(
    swagger({
        documentation: {
            tags: [
                {
                    name: 'Auth',
                    description: 'Authentication and authorization endpoints',
                },
                {
                    name: 'Profiles',
                    description: 'Getting user profile information',
                },
                {
                    name: 'Problems',
                    description: 'Problems management',
                },
                {
                    name: 'Submissions',
                    description: 'Submissions management',
                },
                {
                    name: 'Judge0',
                    description: 'Judge0 feature endpoints',
                },
            ],
        },
    }),
);
