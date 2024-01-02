import App from 'koa';
import createErrorHandler from '@functions/middleware/errorHandler';
import * as errorService from '@functions/services/errorService';
import apiRouter from '@functions/routes/clientApi';

// Initialize all demand configuration for an application
const api = new App();
api.proxy = true;

api.use(createErrorHandler());

const router = apiRouter();
// Register all routes for the application
api.use(router.allowedMethods());
api.use(router.routes());

// Handling all errors
api.on('error', errorService.handleError);

export default api;
