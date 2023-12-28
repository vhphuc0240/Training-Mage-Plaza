import * as functions from 'firebase-functions';

const {app, instagram} = functions.config();

export default {
  isProduction: app.env === 'production',
  baseUrl: app.base_url,
  instagram: {
    id: instagram.id,
    secret: instagram.secret,
    redirectUri: instagram.redirect_uri,
  },
};
