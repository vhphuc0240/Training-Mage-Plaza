import {makeRequest} from '../helpers/api/makeRequest';

export default class ApiManager {
  getNotifications = async () => {
    return this.getApiData();
  };

  getApiData = async () => {
    const API_URL = 'https://localhost:3000/clientApi/notifications';
    return await makeRequest({url: API_URL});
  };
}
