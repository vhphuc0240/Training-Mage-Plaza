import ApiManager from './managers/ApiManager';
import DisplayManager from './managers/DisplayManager';

(async () => {
  const apiManager = new ApiManager();
  const displayManager = new DisplayManager();
  const {notifications} = await apiManager.getNotifications();
  displayManager.init(notifications, window.notificationSettings);
})();
