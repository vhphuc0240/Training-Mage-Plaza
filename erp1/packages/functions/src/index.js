import * as functions from 'firebase-functions';
import apiHandler from './handlers/api';
export const api = functions.https.onRequest(apiHandler.callback());
