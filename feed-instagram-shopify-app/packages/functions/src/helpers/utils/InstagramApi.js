import config from '@functions/config/app';
import axios from 'axios';
import qs from 'qs';
import FormData from 'form-data';

export default class InstagramApi {
  constructor() {
    this.clientId = config.instagram.id;
    this.clientSecret = config.instagram.secret;
    this.redirectUri = config.instagram.redirectUri;
  }

  /**
   *
   * @param longLiveAccessToken
   * @returns {Promise<any|null>}
   */
  refreshInstagramToken = async longLiveAccessToken => {
    try {
      const shortLiveAccessTokenData = await axios.get(
        `https://graph.instagram.com/refresh_access_token?${qs.stringify({
          grant_type: 'ig_refresh_token',
          access_token: longLiveAccessToken
        })}`
      );
      if (shortLiveAccessTokenData.status !== 200) {
        return null;
      }
      return shortLiveAccessTokenData.data;
    } catch (e) {
      console.log(e);
      console.log(e?.response?.data);
      return null;
    }
  };

  /**
   *
   * @param shortLiveAccessToken
   * @returns {Promise<any|null>}
   */
  getLongLiveAccessToken = async shortLiveAccessToken => {
    try {
      const shortLiveAccessTokenData = await axios.get(
        `https://graph.instagram.com/access_token?${qs.stringify({
          grant_type: 'ig_exchange_token',
          client_secret: this.clientSecret,
          access_token: shortLiveAccessToken
        })}`
      );

      if (shortLiveAccessTokenData.status !== 200) {
        return null;
      }
      return shortLiveAccessTokenData.data;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  /**
   *
   * @param userId
   * @param longLiveAccessToken
   * @returns {Promise<any|null>}
   */
  getUserData = async (userId, longLiveAccessToken) => {
    try {
      const shortLiveAccessTokenData = await axios.get(
        `https://graph.instagram.com/me?fields=id,username&access_token=${longLiveAccessToken}`
      );
      if (shortLiveAccessTokenData.status !== 200) {
        return null;
      }
      return shortLiveAccessTokenData.data;
    } catch (e) {
      console.log(e);
      console.log(e?.response?.data);
      return null;
    }
  };

  /**
   *
   * @param code
   * @returns {Promise<any|null>}
   */
  getShortLiveAccessToken = async code => {
    try {
      const form = new FormData();

      form.append('client_id', this.clientId);
      form.append('client_secret', this.clientSecret);
      form.append('grant_type', 'authorization_code');
      form.append('redirect_uri', this.redirectUri);
      form.append('code', code);

      const shortLiveAccessTokenData = await axios.post(
        'https://api.instagram.com/oauth/access_token',
        form,
        {
          headers: {...form.getHeaders()}
        }
      );
      if (shortLiveAccessTokenData.status !== 200) {
        return null;
      }
      return shortLiveAccessTokenData.data;
    } catch (e) {
      console.log(e);
      console.log(e?.response?.data);
      return null;
    }
  };

  /**
   *
   * @param userId
   * @param longLiveAccessToken
   * @returns {Promise<any|null>}
   */
  getMedia = async (userId, longLiveAccessToken) => {
    try {
      const mediaData = await axios.get(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${longLiveAccessToken}`
      );
      if (mediaData.status !== 200) {
        return null;
      }
      return mediaData.data;
    } catch (e) {
      console.log(e);
      console.log(e?.response?.data);
      return null;
    }
  };

  getMediaById = async (mediaId, longLiveAccessToken) => {
    try {
      const mediaData = await axios.get(
        `https://graph.instagram.com/v18.0/${mediaId}?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${longLiveAccessToken}`
      );
      if (mediaData.status !== 200) {
        return null;
      }
      return mediaData.data;
    } catch (e) {
      console.log(e);
      console.log(e?.response?.data);
      return null;
    }
  };
}
