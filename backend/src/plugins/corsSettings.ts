import { Elysia } from 'elysia';
import cors from '@elysiajs/cors';

export const corsSettings = new Elysia().use(
    cors({
        origin: true,
        allowedHeaders: [
            'Authorization',
            'Content-Type',
            'Cookie',
            'Set-Cookie',
            'Access-Control-Allow-Credentials',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
);
