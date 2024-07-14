import { Elysia } from 'elysia';
import authController from './authController';
import profileController from './profileController';
import problemController from './problemController';
import submissionController from './submissionController';
import adminsController from './adminsController';
import userGroupController from './userGroupController';
import problemPackageController from './problemPackageController';

export const controller = new Elysia()
    .use(authController)
    .use(profileController)
    .use(problemController)
    .use(submissionController)
    .use(adminsController)
    .use(userGroupController)
    .use(problemPackageController);
