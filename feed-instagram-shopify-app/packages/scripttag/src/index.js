import ApiManager from './managers/ApiManager';
import DisplayManager from './managers/DisplayManager';

(async () => {
  const apiManager = new ApiManager();
  const displayManager = new DisplayManager();
  const medias = await apiManager.getMedias();
  displayManager.init(medias[0].medias, window.notificationSettings);
})();
