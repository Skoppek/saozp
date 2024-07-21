import { Elysia } from 'elysia';
import profileController from './profileController';
import problemController from './problemController';
import submissionController from './submissionController';
import adminsController from './adminsController';
import groupController from './groupController';
import bundleController from './bundleController';

export const controller = new Elysia()
    .use(profileController)
    .use(problemController)
    .use(submissionController)
    .use(adminsController)
    .use(groupController)
    .use(bundleController);
