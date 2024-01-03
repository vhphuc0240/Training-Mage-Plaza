import {makeRequest} from '../helpers/api/makeRequest';

export default class ApiManager {
  getMedias = async () => {
    return this.getApiData();
  };

  getApiData = async () => {
    const API_URL = 'http://localhost:5000/clientApi/medias';
    return await makeRequest({url: API_URL});
  };
}
